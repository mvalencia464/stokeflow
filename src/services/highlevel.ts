import axios, { AxiosError } from 'axios';

interface HighLevelConfig {
  privateIntegrationToken: string; // Changed from apiKey to privateIntegrationToken
  locationId: string;
}

interface HighLevelContact {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  locationId: string; // Required field for v2 API
}

interface HighLevelContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  locationId: string;
}

interface HighLevelApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class HighLevelService {
  private config: HighLevelConfig | null = null;
  private baseURL = 'https://services.leadconnectorhq.com'; // v2 API for Private Integration Tokens

  constructor() {
    // Initialize with environment variables if available
    const privateIntegrationToken = import.meta.env.VITE_HIGHLEVEL_PRIVATE_TOKEN;
    const locationId = import.meta.env.VITE_HIGHLEVEL_LOCATION_ID;

    if (privateIntegrationToken && locationId) {
      this.configure({ privateIntegrationToken, locationId });
    } else {
      // Try to load from localStorage (persisted integration store)
      this.initializeFromStorage();
    }
  }

  private initializeFromStorage() {
    try {
      const storedData = localStorage.getItem('integration-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const highlevelConfig = parsed.state?.highlevel;

        if (highlevelConfig?.enabled && highlevelConfig.privateIntegrationToken && highlevelConfig.locationId) {
          this.configure({
            privateIntegrationToken: highlevelConfig.privateIntegrationToken,
            locationId: highlevelConfig.locationId,
          });
          console.log('HighLevel service initialized from stored configuration');
        }
      }
    } catch (error) {
      console.warn('Failed to initialize HighLevel from storage:', error);
    }
  }

  configure(config: HighLevelConfig) {
    this.config = config;
    console.log('HighLevel configured with locationId:', config.locationId);
  }

  private get headers() {
    if (!this.config) {
      throw new Error('HighLevel not configured. Call configure() first.');
    }

    const headers = {
      Authorization: `Bearer ${this.config.privateIntegrationToken.trim()}`, // Private Integration tokens DO need "Bearer" prefix
      'Content-Type': 'application/json',
      'Version': '2021-07-28', // Required for v2 API
      'Accept': 'application/json', // Recommended by HighLevel docs
    };

    console.log('Generated headers:', {
      ...headers,
      Authorization: headers.Authorization.substring(0, 30) + '...' // Log partial token for security
    });

    return headers;
  }

  private validateContact(contact: HighLevelContact): void {
    if (!contact.locationId) {
      throw new Error('locationId is required for contact creation');
    }

    if (!contact.email && !contact.phone) {
      throw new Error('Either email or phone is required for contact creation');
    }

    // Validate email format if provided
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      throw new Error('Invalid email format');
    }

    // Validate phone format if provided (basic validation)
    if (contact.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(contact.phone.replace(/[\s\-\(\)]/g, ''))) {
      console.warn('Phone number format may not be valid:', contact.phone);
    }
  }

  private handleApiError(error: AxiosError): never {
    if (error.response) {
      const apiError = error.response.data as HighLevelApiError;
      const statusCode = error.response.status;

      switch (statusCode) {
        case 401:
          throw new Error('Invalid Private Integration Token or unauthorized access to HighLevel');
        case 403:
          throw new Error('Forbidden: Check your Private Integration permissions and location access');
        case 404:
          throw new Error('HighLevel resource not found - check your location ID');
        case 422:
          throw new Error(`Validation error: ${apiError.message || 'Invalid data provided'}`);
        case 429:
          throw new Error('Rate limit exceeded. Please try again later');
        default:
          throw new Error(`HighLevel API error (${statusCode}): ${apiError.message || error.message}`);
      }
    } else if (error.request) {
      throw new Error('Network error: Unable to reach HighLevel API. Check your internet connection.');
    } else {
      throw new Error(`Request setup error: ${error.message}`);
    }
  }

  async createContact(contact: HighLevelContact) {
    if (!this.config) {
      throw new Error('HighLevel not configured');
    }

    // Ensure locationId is set from config if not provided
    const contactPayload: HighLevelContactPayload = {
      ...contact,
      locationId: contact.locationId || this.config.locationId,
    };

    this.validateContact(contactPayload);

    try {
      console.log('Creating HighLevel contact with payload:', contactPayload);

      const response = await axios.post(
        `${this.baseURL}/contacts/`,
        contactPayload,
        {
          headers: this.headers,
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('HighLevel contact created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating HighLevel contact:', error);

      if (axios.isAxiosError(error)) {
        console.error('🔍 API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          url: error.config?.url,
          method: error.config?.method
        });
        this.handleApiError(error);
      }

      throw error;
    }
  }

  async addToWorkflow(contactId: string, workflowId: string) {
    if (!this.config) {
      throw new Error('HighLevel not configured');
    }

    if (!contactId || !workflowId) {
      throw new Error('Both contactId and workflowId are required');
    }

    try {
      console.log(`Adding contact ${contactId} to workflow ${workflowId}`);

      const response = await axios.post(
        `${this.baseURL}/contacts/${contactId}/workflow/${workflowId}`,
        {},
        {
          headers: this.headers,
          timeout: 10000,
        }
      );

      console.log('Contact added to workflow successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding contact to workflow:', error);

      if (axios.isAxiosError(error)) {
        this.handleApiError(error);
      }

      throw error;
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    if (!this.config) {
      throw new Error('HighLevel not configured');
    }

    try {
      console.log('Testing HighLevel connection...');
      console.log('Base URL:', this.baseURL);
      console.log('Location ID:', this.config.locationId);
      console.log('Headers:', this.headers);

      // Try the contacts endpoint as shown in HighLevel docs
      const response = await axios.get(
        `${this.baseURL}/contacts/`,
        {
          headers: this.headers,
          params: {
            locationId: this.config.locationId,
            limit: 1
          },
          timeout: 10000,
        }
      );

      console.log('HighLevel connection test successful:', response.status);
      return true;
    } catch (error) {
      console.error('HighLevel connection test failed:', error);

      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Request headers:', error.config?.headers);
        this.handleApiError(error);
      }

      return false;
    }
  }
}

export const highlevelService = new HighLevelService();