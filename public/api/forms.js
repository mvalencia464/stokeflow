/**
 * StokeFlow Forms API
 * Serves form data for JavaScript widget embedding
 * This would typically be a backend API, but for static hosting we'll use localStorage
 */

// This simulates an API endpoint for form data
window.StokeFlowAPI = {
  
  // Get form data by ID
  getForm: function(formId) {
    try {
      // First try to get from localStorage (same domain)
      const storedData = localStorage.getItem('form-storage');
      if (storedData) {
        const formStore = JSON.parse(storedData);
        const form = formStore.state?.forms?.find(f => f.id === formId);

        if (form) {
          console.log('Found form in localStorage:', form.name);
          return this.convertFormFormat(form);
        }
      }

      // Try to get from parent window (if in iframe)
      if (window.parent !== window) {
        try {
          const parentStorage = window.parent.localStorage.getItem('form-storage');
          if (parentStorage) {
            const parentFormStore = JSON.parse(parentStorage);
            const parentForm = parentFormStore.state?.forms?.find(f => f.id === formId);

            if (parentForm) {
              console.log('Found form in parent localStorage:', parentForm.name);
              return this.convertFormFormat(parentForm);
            }
          }
        } catch (e) {
          // Cross-origin access blocked, continue to fallback
          console.log('Cross-origin localStorage access blocked');
        }
      }

      // Try to fetch from StokeFlow API (if available)
      return this.fetchFormFromAPI(formId);

    } catch (error) {
      console.error('Error loading form:', error);
      return this.getMockForm(formId);
    }
  },

  // Fetch form from StokeFlow API
  fetchFormFromAPI: function(formId) {
    // For now, create a generic form structure for any unknown ID
    // In a real implementation, this would fetch from a backend API

    console.log('Creating generic form for ID:', formId);

    return {
      id: formId,
      name: 'Contact Form',
      description: 'Please fill out this form to get in touch',
      steps: [{
        id: 'step1',
        title: 'Contact Information',
        description: 'Please provide your contact details',
        questions: [
          {
            id: 'name',
            type: 'text',
            title: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'email',
            type: 'text',
            title: 'Email Address',
            required: true,
            placeholder: 'Enter your email address'
          },
          {
            id: 'phone',
            type: 'text',
            title: 'Phone Number',
            required: false,
            placeholder: 'Enter your phone number'
          },
          {
            id: 'message',
            type: 'textarea',
            title: 'Message',
            required: false,
            placeholder: 'How can we help you?'
          }
        ]
      }],
      settings: {
        primaryColor: '#3B82F6',
        showProgressBar: false,
        thankYouMessage: 'Thank you for your submission! We\'ll be in touch soon.'
      }
    };
  },
  
  // Convert StokeFlow internal format to widget format
  convertFormFormat: function(stokeFlowForm) {
    return {
      id: stokeFlowForm.id,
      name: stokeFlowForm.name,
      description: stokeFlowForm.description || '',
      steps: stokeFlowForm.steps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description || '',
        questions: step.questions.map(question => ({
          id: question.id,
          type: question.type,
          title: question.title,
          required: question.required || false,
          placeholder: question.placeholder || '',
          choices: question.choices || []
        }))
      })),
      settings: {
        primaryColor: stokeFlowForm.settings?.primaryColor || '#3B82F6',
        showProgressBar: stokeFlowForm.settings?.showProgressBar !== false,
        thankYouMessage: stokeFlowForm.settings?.thankYouMessage || 'Thank you for your submission!'
      },
      // Include HighLevel configuration for widget
      highlevelConfig: this.getHighLevelConfig()
    };
  },

  // Get HighLevel configuration for widget embedding
  getHighLevelConfig: function() {
    try {
      // Try to get from integration storage
      const integrationStorage = localStorage.getItem('integration-storage');
      if (integrationStorage) {
        const integrationStore = JSON.parse(integrationStorage);
        const highlevelConfig = integrationStore.state?.highlevel;

        if (highlevelConfig?.enabled) {
          return {
            enabled: true,
            token: highlevelConfig.privateIntegrationToken,
            locationId: highlevelConfig.locationId,
            defaultWorkflowId: highlevelConfig.defaultWorkflowId
          };
        }
      }

    } catch (error) {
      console.log('Could not load HighLevel config:', error.message);
    }

    return { enabled: false };
  },
  
  // Mock data for demo forms
  getMockForm: function(formId) {
    const mockForms = {
      'test-highlevel': {
        id: 'test-highlevel',
        name: 'Contact Form',
        description: 'Get in touch with us',
        steps: [{
          id: 's1',
          title: 'Contact Information',
          description: '',
          questions: [
            { 
              id: 'name', 
              type: 'text', 
              title: 'Full Name', 
              required: true, 
              placeholder: 'John Doe' 
            },
            { 
              id: 'email', 
              type: 'text', 
              title: 'Email Address', 
              required: true, 
              placeholder: 'john@example.com' 
            },
            { 
              id: 'phone', 
              type: 'text', 
              title: 'Phone Number', 
              required: true, 
              placeholder: '+1 (555) 123-4567' 
            },
            { 
              id: 'message', 
              type: 'textarea', 
              title: 'Message', 
              required: false, 
              placeholder: 'How can we help you?' 
            }
          ]
        }],
        settings: {
          primaryColor: '#3B82F6',
          showProgressBar: false,
          thankYouMessage: 'Thank you! We\'ll be in touch soon.'
        },
        highlevelConfig: this.getHighLevelConfig()
      },
      'modern-lead-template': {
        id: 'modern-lead-template',
        name: 'Service Quote Request',
        description: 'Get a personalized quote for our services',
        steps: [
          {
            id: 'step1',
            title: 'Service Type',
            description: '',
            questions: [{
              id: 'service',
              type: 'radio',
              title: 'What service do you need?',
              required: true,
              choices: [
                { id: 'moving', value: 'moving', label: 'Moving Services' },
                { id: 'storage', value: 'storage', label: 'Storage Solutions' },
                { id: 'packing', value: 'packing', label: 'Packing Services' }
              ]
            }]
          },
          {
            id: 'step2',
            title: 'Contact Details',
            description: '',
            questions: [
              { id: 'name', type: 'text', title: 'Full Name', required: true, placeholder: 'John Doe' },
              { id: 'email', type: 'text', title: 'Email Address', required: true, placeholder: 'john@example.com' },
              { id: 'phone', type: 'text', title: 'Phone Number', required: true, placeholder: '+1 (555) 123-4567' }
            ]
          }
        ],
        settings: {
          primaryColor: '#10B981',
          showProgressBar: true,
          thankYouMessage: 'Thank you! We\'ll contact you within 24 hours.'
        },
        highlevelConfig: this.getHighLevelConfig()
      }
    };

    return mockForms[formId] || null;
  },
  
  // Submit form data
  submitForm: function(formId, formData) {
    return new Promise((resolve, reject) => {
      try {
        // Log submission
        console.log('📝 Form submitted:', { formId, formData });

        // Save to StokeFlow leads database
        this.saveToLeadsDatabase(formId, formData);

        // Simulate API success
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Form submitted successfully'
          });
        }, 500);

      } catch (error) {
        reject(error);
      }
    });
  },

  // Save lead to StokeFlow leads database
  saveToLeadsDatabase: function(formId, formData) {
    try {
      // Get current leads from localStorage
      const leadsStorage = localStorage.getItem('leads-storage');
      let leadsStore = leadsStorage ? JSON.parse(leadsStorage) : { state: { leads: [] } };

      // Ensure structure exists
      if (!leadsStore.state) leadsStore.state = {};
      if (!leadsStore.state.leads) leadsStore.state.leads = [];

      // Create new lead
      const newLead = {
        id: this.generateId(),
        formId: formId,
        formName: this.getFormName(formId),
        submittedAt: new Date().toISOString(),
        data: formData
      };

      // Add to leads array
      leadsStore.state.leads.unshift(newLead);

      // Save back to localStorage
      localStorage.setItem('leads-storage', JSON.stringify(leadsStore));

      console.log('✅ Lead saved to StokeFlow database:', newLead);

      return newLead;

    } catch (error) {
      console.error('❌ Error saving lead to database:', error);
    }
  },

  // Get form name for lead
  getFormName: function(formId) {
    const form = this.getForm(formId);
    return form ? form.name : 'Contact Form';
  },

  // Generate unique ID
  generateId: function() {
    return 'lead_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
};

// Make API available globally
window.StokeFlowFormsAPI = window.StokeFlowAPI;
