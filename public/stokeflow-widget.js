/**
 * StokeFlow Widget - Native JavaScript Form Embed
 * Embeds forms directly into the page DOM (no iframe)
 * Better responsive design and seamless integration
 */

(function() {
  'use strict';

  // Configuration
  const STOKEFLOW_API_BASE = 'https://stokeflow.netlify.app';
  
  // Widget class
  class StokeFlowWidget {
    constructor(options) {
      this.formId = options.formId;
      this.containerId = options.containerId;
      this.apiBase = options.apiBase || STOKEFLOW_API_BASE;
      this.onSubmit = options.onSubmit || null;
      this.onLoad = options.onLoad || null;
      this.theme = options.theme || {};
      
      this.form = null;
      this.currentStep = 0;
      this.formData = {};
      
      this.init();
    }

    async init() {
      try {
        await this.loadForm();
        await this.loadStyles();
        this.render();
        if (this.onLoad) this.onLoad(this.form);
      } catch (error) {
        console.error('StokeFlow Widget Error:', error);
        this.renderError('Failed to load form');
      }
    }

    async loadForm() {
      // In a real implementation, this would fetch from an API
      // For now, we'll use the mock data structure
      const mockForms = {
        'test-highlevel': {
          id: 'test-highlevel',
          name: 'Contact Form',
          description: 'Get in touch with us',
          steps: [{
            id: 's1',
            title: 'Contact Information',
            questions: [
              { id: 'name', type: 'text', title: 'Full Name', required: true, placeholder: 'John Doe' },
              { id: 'email', type: 'text', title: 'Email Address', required: true, placeholder: 'john@example.com' },
              { id: 'phone', type: 'text', title: 'Phone Number', required: true, placeholder: '+1 (555) 123-4567' },
              { id: 'message', type: 'textarea', title: 'Message', required: false, placeholder: 'How can we help you?' }
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

      this.form = mockForms[this.formId];
      if (!this.form) {
        throw new Error(`Form with ID "${this.formId}" not found`);
      }
    }

    async loadStyles() {
      const primaryColor = this.theme.primaryColor || this.form.settings.primaryColor;
      
      const css = `
        .stokeflow-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .stokeflow-header {
          background: ${primaryColor};
          color: white;
          padding: 24px;
          text-align: center;
        }
        .stokeflow-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }
        .stokeflow-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .stokeflow-progress {
          background: rgba(255,255,255,0.2);
          height: 4px;
          margin-top: 16px;
          border-radius: 2px;
          overflow: hidden;
        }
        .stokeflow-progress-bar {
          background: white;
          height: 100%;
          transition: width 0.3s ease;
        }
        .stokeflow-content {
          padding: 32px;
        }
        .stokeflow-step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #1e293b;
        }
        .stokeflow-question {
          margin-bottom: 24px;
        }
        .stokeflow-label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: #374151;
        }
        .stokeflow-required {
          color: #ef4444;
        }
        .stokeflow-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .stokeflow-input:focus {
          outline: none;
          border-color: ${primaryColor};
        }
        .stokeflow-textarea {
          min-height: 100px;
          resize: vertical;
        }
        .stokeflow-radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stokeflow-radio-option {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .stokeflow-radio-option:hover {
          border-color: ${primaryColor};
          background: #f8fafc;
        }
        .stokeflow-radio-option.selected {
          border-color: ${primaryColor};
          background: ${primaryColor}10;
        }
        .stokeflow-radio-input {
          margin-right: 12px;
        }
        .stokeflow-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          gap: 16px;
        }
        .stokeflow-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .stokeflow-btn-primary {
          background: ${primaryColor};
          color: white;
        }
        .stokeflow-btn-primary:hover {
          opacity: 0.9;
        }
        .stokeflow-btn-secondary {
          background: #f1f5f9;
          color: #64748b;
        }
        .stokeflow-btn-secondary:hover {
          background: #e2e8f0;
        }
        .stokeflow-success {
          text-align: center;
          padding: 48px 32px;
        }
        .stokeflow-success-icon {
          width: 64px;
          height: 64px;
          background: #10b981;
          border-radius: 50%;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
        }
        .stokeflow-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        @media (max-width: 640px) {
          .stokeflow-widget {
            margin: 0;
            border-radius: 0;
          }
          .stokeflow-content {
            padding: 24px 20px;
          }
          .stokeflow-buttons {
            flex-direction: column;
          }
        }
      `;

      // Inject styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = css;
      document.head.appendChild(styleSheet);
    }

    render() {
      const container = document.getElementById(this.containerId);
      if (!container) {
        throw new Error(`Container with ID "${this.containerId}" not found`);
      }

      container.innerHTML = this.getFormHTML();
      this.attachEventListeners();
    }

    getFormHTML() {
      if (this.currentStep >= this.form.steps.length) {
        return this.getSuccessHTML();
      }

      const step = this.form.steps[this.currentStep];
      const progress = ((this.currentStep + 1) / this.form.steps.length) * 100;

      return `
        <div class="stokeflow-widget">
          <div class="stokeflow-header">
            <h2>${this.form.name}</h2>
            <p>${this.form.description}</p>
            ${this.form.settings.showProgressBar ? `
              <div class="stokeflow-progress">
                <div class="stokeflow-progress-bar" style="width: ${progress}%"></div>
              </div>
            ` : ''}
          </div>
          <div class="stokeflow-content">
            <h3 class="stokeflow-step-title">${step.title}</h3>
            <form id="stokeflow-form">
              ${step.questions.map(q => this.getQuestionHTML(q)).join('')}
              <div class="stokeflow-buttons">
                ${this.currentStep > 0 ? '<button type="button" class="stokeflow-btn stokeflow-btn-secondary" onclick="stokeFlowWidget.previousStep()">Previous</button>' : '<div></div>'}
                <button type="submit" class="stokeflow-btn stokeflow-btn-primary">
                  ${this.currentStep === this.form.steps.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    getQuestionHTML(question) {
      const required = question.required ? '<span class="stokeflow-required">*</span>' : '';
      
      switch (question.type) {
        case 'text':
          return `
            <div class="stokeflow-question">
              <label class="stokeflow-label">${question.title} ${required}</label>
              <input type="text" name="${question.id}" class="stokeflow-input" 
                     placeholder="${question.placeholder || ''}" 
                     ${question.required ? 'required' : ''}>
            </div>
          `;
        
        case 'textarea':
          return `
            <div class="stokeflow-question">
              <label class="stokeflow-label">${question.title} ${required}</label>
              <textarea name="${question.id}" class="stokeflow-input stokeflow-textarea" 
                        placeholder="${question.placeholder || ''}" 
                        ${question.required ? 'required' : ''}></textarea>
            </div>
          `;
        
        case 'radio':
          return `
            <div class="stokeflow-question">
              <label class="stokeflow-label">${question.title} ${required}</label>
              <div class="stokeflow-radio-group">
                ${question.choices.map(choice => `
                  <label class="stokeflow-radio-option" onclick="this.classList.add('selected'); 
                         [...this.parentNode.children].forEach(el => el !== this && el.classList.remove('selected'))">
                    <input type="radio" name="${question.id}" value="${choice.value}" 
                           class="stokeflow-radio-input" ${question.required ? 'required' : ''}>
                    ${choice.label}
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        
        default:
          return `<div class="stokeflow-error">Unsupported question type: ${question.type}</div>`;
      }
    }

    getSuccessHTML() {
      return `
        <div class="stokeflow-widget">
          <div class="stokeflow-success">
            <div class="stokeflow-success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>${this.form.settings.thankYouMessage}</p>
          </div>
        </div>
      `;
    }

    attachEventListeners() {
      const form = document.getElementById('stokeflow-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(new FormData(form));
        });
      }
    }

    handleSubmit(formData) {
      // Collect form data
      const stepData = {};
      for (let [key, value] of formData.entries()) {
        stepData[key] = value;
      }
      
      Object.assign(this.formData, stepData);

      if (this.currentStep === this.form.steps.length - 1) {
        // Final submission
        this.submitForm();
      } else {
        // Next step
        this.nextStep();
      }
    }

    nextStep() {
      this.currentStep++;
      this.render();
    }

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.render();
      }
    }

    async submitForm() {
      try {
        console.log('Form submitted:', this.formData);
        
        if (this.onSubmit) {
          await this.onSubmit(this.formData);
        }
        
        // Show success
        this.currentStep = this.form.steps.length;
        this.render();
        
      } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error submitting the form. Please try again.');
      }
    }

    renderError(message) {
      const container = document.getElementById(this.containerId);
      if (container) {
        container.innerHTML = `
          <div class="stokeflow-widget">
            <div class="stokeflow-content">
              <div class="stokeflow-error">${message}</div>
            </div>
          </div>
        `;
      }
    }
  }

  // Global function to create widget
  window.StokeFlow = {
    create: function(options) {
      return new StokeFlowWidget(options);
    },
    ready: function(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    }
  };

  // Mark as loaded
  window.StokeFlowLoaded = true;

  // Trigger ready event for any waiting scripts
  if (window.StokeFlowReadyCallbacks) {
    window.StokeFlowReadyCallbacks.forEach(callback => callback());
    window.StokeFlowReadyCallbacks = [];
  }

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const autoElements = document.querySelectorAll('[data-stokeflow-form]');
    autoElements.forEach(element => {
      const formId = element.getAttribute('data-stokeflow-form');
      const containerId = element.id || 'stokeflow-' + Math.random().toString(36).substr(2, 9);
      element.id = containerId;
      
      new StokeFlowWidget({
        formId: formId,
        containerId: containerId
      });
    });
  });

  // Store reference for button callbacks
  window.stokeFlowWidget = null;
  
})();
