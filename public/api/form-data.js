/**
 * StokeFlow Form Data API
 * Provides cross-domain access to form data for external embedding
 * This creates a JSONP-style API that can be called from any domain
 */

// JSONP callback handler
window.StokeFlowFormData = function(callback, formId) {
  try {
    // Get form data from localStorage
    const storedData = localStorage.getItem('form-storage');
    let formData = null;
    
    if (storedData) {
      const formStore = JSON.parse(storedData);
      const form = formStore.state?.forms?.find(f => f.id === formId);
      
      if (form) {
        console.log('📋 Found form data for external embedding:', form.name);
        
        // Convert to widget format with HighLevel config
        formData = {
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
              choices: question.choices || []
            }))
          })),
          settings: {
            primaryColor: form.settings?.primaryColor || '#3B82F6',
            showProgressBar: form.settings?.showProgressBar !== false,
            thankYouMessage: form.settings?.thankYouMessage || 'Thank you for your submission!'
          },
          // Include HighLevel configuration
          highlevelConfig: getHighLevelConfig()
        };
      }
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

// Auto-execute if called with URL parameters
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const callback = urlParams.get('callback');
  const formId = urlParams.get('formId');
  
  if (callback && formId) {
    // This allows JSONP-style calls like:
    // https://stokeflow.netlify.app/api/form-data.js?callback=myCallback&formId=123
    const callbackFunction = window[callback];
    if (typeof callbackFunction === 'function') {
      window.StokeFlowFormData(callbackFunction, formId);
    }
  }
})();
