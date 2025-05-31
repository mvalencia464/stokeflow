/**
 * StokeFlow Form Data API
 * Provides cross-domain access to form data for external embedding
 * This creates a JSONP-style API that can be called from any domain
 */

// JSONP callback handler
window.StokeFlowFormData = function(callback, formId) {
  try {
    console.log('📋 StokeFlowFormData called for form ID:', formId);

    // Since this script runs on the StokeFlow domain, we can access localStorage
    // But we need to handle the case where this is called from external domains
    let formData = null;

    // Try to get form data from localStorage (this works when script is loaded from StokeFlow domain)
    try {
      console.log('📋 Checking for exported forms first...');

      // First, try to get from exported forms (optimized for embedding)
      const exportedForms = localStorage.getItem('exported-forms');
      if (exportedForms) {
        const forms = JSON.parse(exportedForms);
        if (forms[formId]) {
          console.log('📋 Found exported form data for external embedding:', forms[formId].name);
          formData = forms[formId];
          // Ensure HighLevel config is included
          formData.highlevelConfig = getHighLevelConfig();
        }
      }

      // Only check live forms if we didn't find exported forms
      if (!formData) {
        console.log('📋 Checking localStorage for live form data...');

        // Fallback: Try both possible localStorage keys for live forms
        let storedData = localStorage.getItem('forms-storage'); // Zustand persist key
        if (!storedData) {
          storedData = localStorage.getItem('form-storage'); // Legacy key
        }

        if (storedData) {
          const formStore = JSON.parse(storedData);
          // Handle both Zustand format and legacy format
          const forms = formStore.state?.forms || formStore.forms || [];
          const form = forms.find(f => f.id === formId);

          if (form) {
            console.log('📋 Found live form data for external embedding:', form.name);

            // Convert to widget format with HighLevel config
            formData = convertFormToWidgetFormat(form);
          } else {
            console.log('📋 Form not found in localStorage for ID:', formId);
            console.log('📋 Available form IDs:', forms.map(f => f.id));
          }
        } else {
          console.log('📋 No forms-storage found in localStorage');
        }
      }
    } catch (storageError) {
      console.log('📋 Could not access localStorage:', storageError.message);
    }

    // If no form data found, try hardcoded forms for known IDs
    if (!formData) {
      formData = getHardcodedForm(formId);
    }

    // Call the callback with the form data
    if (typeof callback === 'function') {
      callback(formData);
    }

  } catch (error) {
    console.error('Error loading form data:', error);
    if (typeof callback === 'function') {
      callback(null);
    }
  }
};

// Get HighLevel configuration
function getHighLevelConfig() {
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

    // Fallback to hardcoded values from .env (for external embedding)
    const envToken = 'pit-07042cbb-2b38-4e74-9e2d-c8e1305177e7';
    const envLocationId = 'BK5WOlszHMZB0udM7qC1';
    
    if (envToken && envLocationId) {
      console.log('📋 Using fallback HighLevel config for external embedding');
      return {
        enabled: true,
        token: envToken,
        locationId: envLocationId
      };
    }

  } catch (error) {
    console.log('Could not load HighLevel config:', error.message);
  }

  return { enabled: false };
}

// Convert StokeFlow form format to widget format
function convertFormToWidgetFormat(form) {
  return {
    id: form.id,
    name: form.name,
    description: form.description || '',
    steps: form.steps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description || '',
      questions: step.questions.map(question => ({
        id: question.id,
        type: question.type,
        title: question.title,
        required: question.required || false,
        placeholder: question.placeholder || '',
        helpText: question.helpText || '',
        choices: question.choices ? question.choices.map(choice => ({
          id: choice.id,
          value: choice.value || choice.label,
          label: choice.label,
          image: choice.imageUrl || choice.image
        })) : []
      }))
    })),
    settings: {
      primaryColor: form.settings?.primaryColor || '#3B82F6',
      showProgressBar: form.settings?.showProgressBar !== false,
      thankYouMessage: form.settings?.thankYouMessage || 'Thank you for your submission!',
      logoUrl: form.settings?.logoUrl,
      redirectUrl: form.settings?.redirectUrl
    },
    // Include HighLevel configuration
    highlevelConfig: getHighLevelConfig()
  };
}

// Get hardcoded form data for known form IDs
function getHardcodedForm(formId) {
  console.log('📋 Checking hardcoded forms for ID:', formId);

  // Your specific form ID with the remodeling service selection
  if (formId === 'fa915b1e-f8a6-485c-9f47-62f2a9a060ff') {
    console.log('📋 Returning hardcoded "Newest" form data');
    return {
      id: formId,
      name: 'Newest',
      description: 'Select the type of remodeling service you need',
      steps: [
        {
          id: 'f2680c60-655d-407e-ac95-bde9f79c752e',
          title: 'I Need A Quote For...',
          description: 'Select the type of remodeling service you need',
          questions: [
            {
              id: 'service-type',
              type: 'image-choice',
              title: 'What type of remodeling service do you need?',
              required: true,
              choices: [
                {
                  id: 'home-removals',
                  label: 'Home Removals',
                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
                },
                {
                  id: 'office-removals',
                  label: 'Office Removals',
                  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop'
                },
                {
                  id: 'long-distance',
                  label: 'Long Distance Moves',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
                },
                {
                  id: 'student-moves',
                  label: 'Student Moves',
                  image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop'
                },
                {
                  id: 'furniture-storage',
                  label: 'Furniture & Storage Items',
                  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
                },
                {
                  id: 'packing-services',
                  label: 'Packing Services',
                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
                }
              ]
            }
          ]
        },
        {
          id: 'contact-step',
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
        }
      ],
      settings: {
        primaryColor: '#dc2626',
        showProgressBar: true,
        thankYouMessage: 'Thank you! We\'ll contact you within 24 hours.'
      },
      highlevelConfig: getHighLevelConfig()
    };
  }

  // Default fallback form
  return null;
}

// Auto-execute if called with URL parameters
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const callback = urlParams.get('callback');
  const formId = urlParams.get('formId');

  if (callback && formId) {
    console.log('📋 Form data API called with:', { callback, formId });

    // This allows JSONP-style calls like:
    // https://stokeflow.netlify.app/api/form-data.js?callback=myCallback&formId=123
    const callbackFunction = window[callback];
    if (typeof callbackFunction === 'function') {
      console.log('📋 Executing callback function');
      window.StokeFlowFormData(callbackFunction, formId);
    } else {
      console.log('📋 Callback function not found:', callback);
    }
  } else {
    console.log('📋 Form data API loaded but no callback/formId provided');
  }
})();
