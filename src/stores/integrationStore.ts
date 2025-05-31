import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { highlevelService } from '../services/highlevel';

interface IntegrationState {
  highlevel: {
    enabled: boolean;
    privateIntegrationToken: string;
    locationId: string;
    defaultWorkflowId?: string;
  };
  configureHighLevel: (config: {
    privateIntegrationToken: string;
    locationId: string;
    defaultWorkflowId?: string;
  }) => void;
  testHighLevelConnection: () => Promise<boolean>;
  syncLeadToHighLevel: (formData: Record<string, any>) => Promise<void>;
}

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set, get) => ({
      highlevel: {
        enabled: false,
        privateIntegrationToken: '',
        locationId: '',
      },

      configureHighLevel: (config) => {
        highlevelService.configure({
          privateIntegrationToken: config.privateIntegrationToken,
          locationId: config.locationId,
        });

        set({
          highlevel: {
            enabled: true,
            ...config,
          },
        });
      },

      testHighLevelConnection: async () => {
        const { highlevel } = get();
        if (!highlevel.enabled) {
          throw new Error('HighLevel integration not enabled');
        }
        return await highlevelService.testConnection();
      },

  syncLeadToHighLevel: async (formData) => {
    const { highlevel } = get();
    console.log('🔧 HighLevel integration status:', {
      enabled: highlevel.enabled,
      hasToken: !!highlevel.privateIntegrationToken,
      hasLocationId: !!highlevel.locationId,
      tokenPreview: highlevel.privateIntegrationToken ? highlevel.privateIntegrationToken.substring(0, 10) + '...' : 'none'
    });
    console.log('📝 Form data received:', formData);

    if (!highlevel.enabled) {
      console.log('⚠️ HighLevel integration is not enabled, skipping sync');
      return;
    }

    if (!highlevel.privateIntegrationToken || !highlevel.locationId) {
      console.log('⚠️ HighLevel integration missing credentials, skipping sync');
      return;
    }

    try {
      // Helper function to find field value by multiple possible keys
      const findFieldValue = (possibleKeys: string[]) => {
        for (const key of possibleKeys) {
          if (formData[key]) return formData[key];
        }
        return '';
      };

      // Extract name parts - try multiple field name variations
      let firstName = '', lastName = '';
      const fullName = findFieldValue(['Full Name', 'fullName', 'full_name', 'name']);
      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Override with specific first/last name fields if available
      firstName = findFieldValue(['First Name', 'firstName', 'first_name']) || firstName;
      lastName = findFieldValue(['Last Name', 'lastName', 'last_name']) || lastName;

      // Find email and phone with multiple variations
      const email = findFieldValue(['Email Address', 'Email', 'email', 'emailAddress', 'email_address']);
      const phone = findFieldValue(['Phone Number', 'Phone', 'phone', 'phoneNumber', 'phone_number']);

      // Validate email format
      const isValidEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      // Validate phone format (basic - remove spaces, dashes, parentheses)
      const cleanPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
      const isValidPhone = cleanPhone && /^[\+]?[1-9][\d]{7,15}$/.test(cleanPhone);

      console.log('📧 Email validation:', { email, isValidEmail });
      console.log('📱 Phone validation:', { phone, cleanPhone, isValidPhone });

      // Create contact payload
      const contact = {
        firstName: firstName || 'Unknown',
        lastName: lastName || 'User',
        email: isValidEmail ? email : undefined,
        phone: isValidPhone ? cleanPhone : undefined,
        locationId: highlevel.locationId, // Required for v2 API
        source: 'LeadFlow Form',
        tags: ['LeadFlow'],
        customFields: [
          {
            key: 'form_submission_date',
            field_value: new Date().toISOString()
          },
          // Add all form fields as custom fields
          ...Object.entries(formData).map(([key, value]) => ({
            key: key.toLowerCase().replace(/\s+/g, '_'),
            field_value: String(value)
          }))
        ],
      };

      console.log('Syncing contact to HighLevel:', contact);

      // Validate required fields before sending
      if (!contact.email && !contact.phone) {
        console.error('❌ Cannot create contact: Either valid email or phone is required');
        console.error('📋 Available form data:', Object.keys(formData));
        throw new Error('Either valid email or phone is required for HighLevel contact creation');
      }

      // Create contact in HighLevel
      console.log('📞 Making API call to HighLevel...');
      const result = await highlevelService.createContact(contact);
      console.log('✅ HighLevel contact created successfully:', result);

      // Add to default workflow if configured
      if (highlevel.defaultWorkflowId && result.contact?.id) {
        await highlevelService.addToWorkflow(
          result.contact.id,
          highlevel.defaultWorkflowId
        );
        console.log('Contact added to workflow:', highlevel.defaultWorkflowId);
      }
    } catch (error) {
      console.error('Error syncing lead to HighLevel:', error);
      throw error;
    }
  },
    }),
    {
      name: 'integration-storage', // localStorage key
      partialize: (state) => ({ highlevel: state.highlevel }), // Only persist highlevel config
    }
  )
);