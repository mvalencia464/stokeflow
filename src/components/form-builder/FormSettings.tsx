import { useState } from 'react';
import { useFormStore, Form } from '../../stores/formStore';

interface FormSettingsProps {
  form: Form;
  onClose: () => void;
}

const FormSettings = ({ form, onClose }: FormSettingsProps) => {
  const { updateForm } = useFormStore();
  const [formData, setFormData] = useState({
    name: form.name,
    description: form.description || '',
    settings: {
      ...form.settings
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };
  
  const handleSave = () => {
    updateForm({
      ...form,
      name: formData.name,
      description: formData.description,
      settings: formData.settings
    });
    onClose();
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Form Settings</h3>
      
      <div>
        <label htmlFor="name" className="form-label">Form Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter form name"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Describe the purpose of this form"
        />
      </div>
      
      <div>
        <label htmlFor="primaryColor" className="form-label">Primary Color</label>
        <div className="flex space-x-2">
          <input
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={formData.settings.primaryColor}
            onChange={handleSettingChange}
            className="h-10 w-10 rounded border border-slate-300"
          />
          <input
            type="text"
            value={formData.settings.primaryColor}
            onChange={handleSettingChange}
            name="primaryColor"
            className="input-field"
            placeholder="#3B82F6"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="logoUrl" className="form-label">Logo URL (Optional)</label>
        <input
          type="text"
          id="logoUrl"
          name="logoUrl"
          value={formData.settings.logoUrl || ''}
          onChange={handleSettingChange}
          className="input-field"
          placeholder="https://example.com/logo.png"
        />
      </div>
      
      <div>
        <label htmlFor="redirectUrl" className="form-label">Redirect URL (Optional)</label>
        <input
          type="text"
          id="redirectUrl"
          name="redirectUrl"
          value={formData.settings.redirectUrl || ''}
          onChange={handleSettingChange}
          className="input-field"
          placeholder="https://example.com/thank-you"
        />
        <p className="mt-1 text-xs text-slate-500">
          If provided, users will be redirected to this URL after form submission
        </p>
      </div>
      
      <div>
        <label htmlFor="thankYouMessage" className="form-label">Thank You Message</label>
        <textarea
          id="thankYouMessage"
          name="thankYouMessage"
          rows={2}
          value={formData.settings.thankYouMessage}
          onChange={handleSettingChange}
          className="input-field"
          placeholder="Thank you for your submission!"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showProgressBar"
          name="showProgressBar"
          checked={formData.settings.showProgressBar}
          onChange={handleSettingChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
        />
        <label htmlFor="showProgressBar" className="ml-2 block text-sm text-slate-700">
          Show progress bar on form
        </label>
      </div>
      
      <div className="flex justify-end pt-4 space-x-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default FormSettings;