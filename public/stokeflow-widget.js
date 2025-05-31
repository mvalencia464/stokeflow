/**
 * StokeFlow Widget - Native JavaScript Form Embed
 * Embeds forms directly into the page DOM (no iframe)
 * Better responsive design and seamless integration
 */

(function() {
  'use strict';

  // Configuration
  const STOKEFLOW_API_BASE = 'https://stokeflow.netlify.app';
  
  // Global widget registry
  window.stokeFlowWidgets = window.stokeFlowWidgets || {};

  // Widget class
  class StokeFlowWidget {
    constructor(options) {
      this.formId = options.formId;
      this.containerId = options.containerId;
      this.apiBase = options.apiBase || STOKEFLOW_API_BASE;
      this.onSubmit = options.onSubmit || null;
      this.onLoad = options.onLoad || null;
      this.theme = options.theme || {};
      this.options = options; // Store all options for HighLevel integration

      this.form = null;
      this.currentStep = 0;
      this.formData = {};
      this.widgetId = this.containerId + '_widget';

      // Register this widget instance
      window.stokeFlowWidgets[this.widgetId] = this;

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
      try {
        // Check if form data was provided directly in options
        if (this.options.formData) {
          this.form = this.options.formData;
          console.log('Using provided form data:', this.form.name);
          return;
        }

        // Check for shared forms (from URL parameters)
        if (window.StokeFlowSharedForms && window.StokeFlowSharedForms[this.formId]) {
          this.form = window.StokeFlowSharedForms[this.formId];
          console.log('Using shared form data:', this.form.name);
          return;
        }

        // Load the forms API if not already loaded
        if (!window.StokeFlowAPI) {
          await this.loadFormsAPI();
        }

        // Try to get real form data from StokeFlow API first
        await this.tryLoadRealFormData();

        // If we still don't have form data, use the API fallback
        if (!this.form) {
          this.form = window.StokeFlowAPI.getForm(this.formId);
        }

        if (!this.form) {
          throw new Error(`Form with ID "${this.formId}" not found`);
        }

      } catch (error) {
        console.error('Error loading form:', error);
        throw error;
      }
    }

    async loadFormsAPI() {
      return new Promise((resolve, reject) => {
        if (window.StokeFlowAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = this.apiBase + '/api/forms.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load forms API'));
        document.head.appendChild(script);
      });
    }

    async tryLoadRealFormData() {
      return new Promise((resolve) => {
        try {
          // Create a unique callback name
          const callbackName = 'stokeFlowCallback_' + Math.random().toString(36).substr(2, 9);

          // Create the callback function
          window[callbackName] = (formData) => {
            if (formData) {
              console.log('📋 Loaded real form data via cross-domain API:', formData.name);
              this.form = formData;
            } else {
              console.log('📋 No real form data found, will use generic form');
            }

            // Cleanup
            delete window[callbackName];
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
            resolve();
          };

          // Create script tag for JSONP-style call
          const script = document.createElement('script');
          script.src = `${this.apiBase}/api/form-data.js?callback=${callbackName}&formId=${this.formId}`;
          script.onerror = () => {
            console.log('📋 Could not load real form data, will use generic form');
            delete window[callbackName];
            resolve();
          };

          // Set timeout to avoid hanging
          setTimeout(() => {
            if (window[callbackName]) {
              console.log('📋 Timeout loading real form data, will use generic form');
              delete window[callbackName];
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              resolve();
            }
          }, 3000);

          document.head.appendChild(script);

        } catch (error) {
          console.log('📋 Error trying to load real form data:', error.message);
          resolve();
        }
      });
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
      const widgetId = this.containerId + '_widget';

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
            <form id="stokeflow-form-${this.containerId}">
              ${step.questions.map(q => this.getQuestionHTML(q)).join('')}
              <div class="stokeflow-buttons">
                ${this.currentStep > 0 ? `<button type="button" class="stokeflow-btn stokeflow-btn-secondary" data-widget-id="${widgetId}" onclick="window.stokeFlowWidgets['${widgetId}'].previousStep()">Previous</button>` : '<div></div>'}
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
      const form = document.getElementById(`stokeflow-form-${this.containerId}`);
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

        // Submit to StokeFlow API
        if (window.StokeFlowAPI) {
          await window.StokeFlowAPI.submitForm(this.formId, this.formData);
        }

        // Submit to HighLevel if configured
        await this.submitToHighLevel();

        // Call custom onSubmit handler
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

    async submitToHighLevel() {
      try {
        // Check if HighLevel integration is configured
        const hlToken = this.getHighLevelToken();
        const hlLocationId = this.getHighLevelLocationId();

        if (!hlToken || !hlLocationId) {
          console.log('HighLevel integration not configured');
          return;
        }

        // Prepare contact data for HighLevel
        const contactData = this.prepareHighLevelData();

        if (!contactData.email && !contactData.phone) {
          console.log('No email or phone provided - skipping HighLevel sync');
          return;
        }

        // Submit to HighLevel (using v2 API for Private Integration tokens)
        const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hlToken}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            ...contactData,
            locationId: hlLocationId,
            source: 'StokeFlow Form'
          })
        });

        console.log('HighLevel API Response Status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Successfully synced to HighLevel:', result);
        } else {
          const errorText = await response.text();
          console.error('❌ HighLevel sync failed:', response.status, errorText);
        }

      } catch (error) {
        console.error('HighLevel integration error:', error);
        // Don't fail the form submission if HighLevel sync fails
      }
    }

    getHighLevelToken() {
      // Try multiple sources for the token
      return this.options?.highLevelToken ||
             window.STOKEFLOW_HIGHLEVEL_TOKEN ||
             this.form?.highlevelConfig?.token ||
             this.getFromStokeFlowConfig('privateIntegrationToken') ||
             localStorage.getItem('stokeflow_hl_token');
    }

    getHighLevelLocationId() {
      // Try multiple sources for the location ID
      return this.options?.highLevelLocationId ||
             window.STOKEFLOW_HIGHLEVEL_LOCATION_ID ||
             this.form?.highlevelConfig?.locationId ||
             this.getFromStokeFlowConfig('locationId') ||
             localStorage.getItem('stokeflow_hl_location_id');
    }

    getFromStokeFlowConfig(key) {
      try {
        // Try to get from StokeFlow integration store (same domain)
        const integrationStorage = localStorage.getItem('integration-storage');
        if (integrationStorage) {
          const integrationStore = JSON.parse(integrationStorage);
          const highlevelConfig = integrationStore.state?.highlevel;

          if (highlevelConfig?.enabled && highlevelConfig[key]) {
            console.log(`📋 Found ${key} from StokeFlow integration config`);
            return highlevelConfig[key];
          }
        }
      } catch (error) {
        console.log('Could not access StokeFlow integration config:', error.message);
      }
      return null;
    }

    prepareHighLevelData() {
      const data = {
        customFields: []
      };

      // Map common fields by both field ID and question title
      Object.entries(this.formData).forEach(([key, value]) => {
        if (!value) return; // Skip empty values

        // Get the question title for this field ID
        const questionTitle = this.getQuestionTitle(key);
        const fieldName = key.toLowerCase();
        const titleName = questionTitle ? questionTitle.toLowerCase() : '';

        // Check both field ID and question title for mapping
        if (this.isNameField(fieldName, titleName)) {
          // Split full name into first and last
          const nameParts = String(value).trim().split(' ');
          data.firstName = nameParts[0] || 'Unknown';
          data.lastName = nameParts.slice(1).join(' ') || 'User';
        } else if (this.isFirstNameField(fieldName, titleName)) {
          data.firstName = String(value).trim();
        } else if (this.isLastNameField(fieldName, titleName)) {
          data.lastName = String(value).trim();
        } else if (this.isEmailField(fieldName, titleName)) {
          data.email = String(value).trim();
        } else if (this.isPhoneField(fieldName, titleName)) {
          data.phone = String(value).trim();
        } else {
          // Add as custom field
          data.customFields.push({
            key: (questionTitle || key).toLowerCase().replace(/\s+/g, '_'),
            field_value: String(value)
          });
        }
      });

      // Ensure we have at least basic names
      if (!data.firstName && !data.lastName) {
        data.firstName = 'Unknown';
        data.lastName = 'User';
      }

      // Add form submission metadata
      data.customFields.push({
        key: 'form_submission_date',
        field_value: new Date().toISOString()
      });

      data.customFields.push({
        key: 'form_id',
        field_value: this.formId
      });

      console.log('📋 Prepared HighLevel contact data:', data);
      return data;
    }

    // Get question title by field ID
    getQuestionTitle(fieldId) {
      if (!this.form || !this.form.steps) return null;

      for (const step of this.form.steps) {
        for (const question of step.questions) {
          if (question.id === fieldId) {
            return question.title;
          }
        }
      }
      return null;
    }

    // Field detection helpers
    isNameField(fieldName, titleName) {
      const namePatterns = ['name', 'fullname', 'full_name', 'full name'];
      return namePatterns.some(pattern =>
        fieldName.includes(pattern) || titleName.includes(pattern)
      );
    }

    isFirstNameField(fieldName, titleName) {
      const firstNamePatterns = ['firstname', 'first_name', 'first name'];
      return firstNamePatterns.some(pattern =>
        fieldName.includes(pattern) || titleName.includes(pattern)
      );
    }

    isLastNameField(fieldName, titleName) {
      const lastNamePatterns = ['lastname', 'last_name', 'last name'];
      return lastNamePatterns.some(pattern =>
        fieldName.includes(pattern) || titleName.includes(pattern)
      );
    }

    isEmailField(fieldName, titleName) {
      const emailPatterns = ['email', 'e-mail', 'email address'];
      return emailPatterns.some(pattern =>
        fieldName.includes(pattern) || titleName.includes(pattern)
      );
    }

    isPhoneField(fieldName, titleName) {
      const phonePatterns = ['phone', 'phonenumber', 'phone_number', 'phone number', 'mobile', 'cell'];
      return phonePatterns.some(pattern =>
        fieldName.includes(pattern) || titleName.includes(pattern)
      );
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
  
})();
