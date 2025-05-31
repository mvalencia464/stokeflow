import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../stores/formStore';
import { ArrowLeft } from 'lucide-react';

const FormBuilder = () => {
  const navigate = useNavigate();
  const { createForm } = useFormStore();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  const handleCreate = () => {
    if (!formName.trim()) return;
    
    const formId = createForm(formName, formDescription);
    navigate(`/dashboard/forms/${formId}/edit`);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <button 
          onClick={() => navigate('/dashboard/forms')}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Form</h1>
      </div>
      
      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="formName" className="form-label">Form Name</label>
            <input
              type="text"
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input-field"
              placeholder="e.g., Customer Feedback Survey"
            />
          </div>
          
          <div>
            <label htmlFor="formDescription" className="form-label">Description (Optional)</label>
            <textarea
              id="formDescription"
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="input-field"
              placeholder="Describe the purpose of this form"
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleCreate}
              disabled={!formName.trim()}
              className={`btn-primary ${!formName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Create Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;