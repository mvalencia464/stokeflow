/**
 * StokeFlow Form Sharing System
 * Allows forms to be shared via URL parameters or exported/imported
 */

window.StokeFlowShare = {
  
  // Export form data to URL-safe format
  exportForm: function(formId) {
    try {
      const storedData = localStorage.getItem('form-storage');
      if (!storedData) return null;
      
      const formStore = JSON.parse(storedData);
      const form = formStore.state?.forms?.find(f => f.id === formId);
      
      if (!form) return null;
      
      // Create a simplified version for sharing
      const shareableForm = {
        id: form.id,
        name: form.name,
        description: form.description || '',
        steps: form.steps.map(step => ({
          id: step.id,
          title: step.title,
          description: step.description || '',
          questions: step.questions.map(q => ({
            id: q.id,
            type: q.type,
            title: q.title,
            required: q.required || false,
            placeholder: q.placeholder || '',
            choices: q.choices || []
          }))
        })),
        settings: {
          primaryColor: form.settings?.primaryColor || '#3B82F6',
          showProgressBar: form.settings?.showProgressBar !== false,
          thankYouMessage: form.settings?.thankYouMessage || 'Thank you!'
        }
      };
      
      // Encode for URL sharing
      return btoa(JSON.stringify(shareableForm));
      
    } catch (error) {
      console.error('Error exporting form:', error);
      return null;
    }
  },
  
  // Import form data from encoded string
  importForm: function(encodedForm) {
    try {
      const formData = JSON.parse(atob(encodedForm));
      return formData;
    } catch (error) {
      console.error('Error importing form:', error);
      return null;
    }
  },
  
  // Get form from URL parameter
  getFormFromURL: function(formId) {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedForm = urlParams.get('form_' + formId);
    
    if (encodedForm) {
      return this.importForm(encodedForm);
    }
    
    return null;
  },
  
  // Generate shareable URL for a form
  generateShareURL: function(formId, baseURL = window.location.origin) {
    const encodedForm = this.exportForm(formId);
    if (!encodedForm) return null;
    
    return `${baseURL}?form_${formId}=${encodedForm}`;
  },
  
  // Create embedding code with form data included
  generateEmbedCode: function(formId, options = {}) {
    const encodedForm = this.exportForm(formId);
    if (!encodedForm) return null;
    
    const containerId = options.containerId || 'stokeflow-form';
    const widgetURL = options.widgetURL || 'https://stokeflow.netlify.app/stokeflow-widget.js';
    
    return `<!-- StokeFlow Form Embed -->
<div id="${containerId}"></div>
<script src="${widgetURL}"></script>
<script>
StokeFlow.ready(function() {
  // Form data embedded directly
  const formData = ${JSON.stringify(this.importForm(encodedForm), null, 2)};
  
  const widget = StokeFlow.create({
    formId: '${formId}',
    containerId: '${containerId}',
    formData: formData, // Use embedded form data
    ${options.highLevelToken ? `highLevelToken: '${options.highLevelToken}',` : ''}
    ${options.highLevelLocationId ? `highLevelLocationId: '${options.highLevelLocationId}',` : ''}
    ${options.primaryColor ? `theme: { primaryColor: '${options.primaryColor}' },` : ''}
    onSubmit: function(data) {
      console.log('Form submitted:', data);
      ${options.onSubmit || ''}
    }
  });
});
</script>`;
  }
};

// Auto-initialize if form data is in URL
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Look for form parameters in URL
  for (const [key, value] of urlParams.entries()) {
    if (key.startsWith('form_')) {
      const formId = key.replace('form_', '');
      const formData = window.StokeFlowShare.importForm(value);
      
      if (formData) {
        // Store in temporary location for widget to find
        window.StokeFlowSharedForms = window.StokeFlowSharedForms || {};
        window.StokeFlowSharedForms[formId] = formData;
        console.log('Loaded shared form:', formData.name);
      }
    }
  }
});
