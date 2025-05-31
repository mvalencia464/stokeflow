import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useLeadsStore } from '../../stores/leadsStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import FormRenderer from '../../components/form-preview/FormRenderer';

const FormPreview = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getForm } = useFormStore();
  const { addLead } = useLeadsStore();
  const { trackFormView, trackFormSubmission } = useAnalyticsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = formId ? getForm(formId) : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      // Track form view when form loads successfully
      if (form && formId) {
        console.log('📊 Tracking form view for:', formId);
        trackFormView(formId);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form, formId, trackFormView]);
  
  const handleSubmit = async (data: Record<string, any>) => {
    if (!form) return;

    try {
      setError(null);
      console.log('🚀 Form submitted with data:', data);
      console.log('📝 Form details:', { id: form.id, name: form.name });

      // Track form submission
      console.log('📊 Tracking form submission for:', form.id);
      trackFormSubmission(form.id);

      await addLead(form.id, form.name, data);
      console.log('✅ Lead added successfully');

      // If there's a redirect URL, redirect after a short delay
      if (form.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl!;
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Error submitting form:', err);
      setError('There was an error submitting the form. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Activity className="h-10 w-10 text-primary-500 animate-pulse mx-auto mb-4" />
          <p className="text-slate-500">Loading form...</p>
        </div>
      </div>
    );
  }
  
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Form Not Found</h2>
          <p className="text-slate-500 mb-6">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-50"
      style={{ 
        '--form-primary-color': form.settings.primaryColor 
      } as React.CSSProperties}
    >
      {/* Form Header */}
      <header className="py-6 px-4 sm:px-6 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          {form.settings.logoUrl ? (
            <img 
              src={form.settings.logoUrl} 
              alt="Logo" 
              className="h-8"
            />
          ) : (
            <Activity className="h-8 w-8" style={{ color: form.settings.primaryColor }} />
          )}
          <h1 className="ml-2 text-xl font-bold text-slate-900">{form.name}</h1>
        </div>
      </header>
      
      {/* Form Content */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              {error}
            </div>
          )}
          <FormRenderer form={form} onSubmit={handleSubmit} />
        </div>
      </main>
      
      {/* Form Footer */}
      <footer className="py-4 px-4 sm:px-6 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center text-xs text-slate-500">
          Powered by <span className="font-medium">LeadFlow</span>
        </div>
      </footer>
    </div>
  );
};

export default FormPreview;