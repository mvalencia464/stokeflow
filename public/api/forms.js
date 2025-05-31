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
      // Try to get from localStorage (where StokeFlow stores forms)
      const storedData = localStorage.getItem('form-storage');
      if (storedData) {
        const formStore = JSON.parse(storedData);
        const form = formStore.state?.forms?.find(f => f.id === formId);
        
        if (form) {
          // Convert StokeFlow form format to widget format
          return this.convertFormFormat(form);
        }
      }
      
      // Fallback to mock data for demo forms
      return this.getMockForm(formId);
      
    } catch (error) {
      console.error('Error loading form:', error);
      return null;
    }
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
      }
    };
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
        }
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
        }
      }
    };

    return mockForms[formId] || null;
  },
  
  // Submit form data
  submitForm: function(formId, formData) {
    return new Promise((resolve, reject) => {
      try {
        // Log submission
        console.log('Form submitted:', { formId, formData });
        
        // Here you would typically send to your backend
        // For now, we'll simulate success
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
  }
};

// Make API available globally
window.StokeFlowFormsAPI = window.StokeFlowAPI;
