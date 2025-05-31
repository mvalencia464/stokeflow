import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import FormEditor from '../../components/form-builder/FormEditor';

const FormEdit = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { getForm, setCurrentForm } = useFormStore();
  
  useEffect(() => {
    if (formId) {
      setCurrentForm(formId);
    }
    
    return () => {
      setCurrentForm(null);
    };
  }, [formId, setCurrentForm]);
  
  const form = formId ? getForm(formId) : null;
  
  if (!form) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Form Not Found</h2>
        <p className="text-slate-500 mb-6">The form you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/dashboard/forms" className="btn-primary">
          Back to Forms
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/dashboard/forms')}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{form.name}</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/form/${formId}`} 
            target="_blank"
            className="btn-secondary"
          >
            Preview
            <ExternalLink className="h-4 w-4 ml-1.5" />
          </Link>
          
          <Link 
            to={`/dashboard/forms/${formId}/embed`}
            className="btn-primary"
          >
            Embed Form
          </Link>
        </div>
      </div>
      
      <FormEditor formId={formId} />
    </div>
  );
};

export default FormEdit;