import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';

const EmbedInstructions = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getForm } = useFormStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'iframe' | 'javascript'>('iframe');
  
  const form = formId ? getForm(formId) : null;
  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
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
  
  const getEmbedCode = () => {
    const baseUrl = window.location.origin;

    if (activeTab === 'iframe') {
      return `<iframe
  src="${baseUrl}/form/${formId}"
  width="100%"
  height="600"
  style="border: none; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
  title="${form.name}"
></iframe>`;
    } else {
      return `<div data-stokeflow-form="${formId}"></div>
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>`;
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode()).then(() => {
      setCopied(true);
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Link 
          to={`/dashboard/forms/${formId}/edit`}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Embed "{form.name}"</h1>
      </div>
      
      <div className="card overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'iframe' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('iframe')}
            >
              iFrame Embed
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'javascript' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setActiveTab('javascript')}
            >
              JavaScript Embed
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            {activeTab === 'iframe' ? 'Embed with iframe' : 'Embed with JavaScript'}
          </h3>
          <p className="text-slate-500 mb-4">
            {activeTab === 'iframe' 
              ? 'Copy and paste this code into your website HTML where you want the form to appear.'
              : 'This method provides better integration with your website and responsive behavior.'}
          </p>
          
          <div className="relative">
            <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">{getEmbedCode()}</pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-slate-700 text-white rounded hover:bg-slate-600"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-slate-900 mb-2">Preview</h4>
            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
              <div className="aspect-video max-h-[400px] rounded border border-dashed border-slate-300 bg-white flex items-center justify-center">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium text-slate-800 mb-1">{form.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{form.description || 'Form preview'}</p>
                  <Link 
                    to={`/form/${formId}`} 
                    target="_blank"
                    className="btn-primary"
                  >
                    Open Form Preview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6 mt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-1">Customize Appearance</h3>
        <p className="text-slate-500 mb-4">
          You can customize the form's appearance to match your website's branding.
        </p>
        
        <Link 
          to={`/dashboard/forms/${formId}/edit`}
          className="btn-secondary"
        >
          Edit Form Settings
        </Link>
      </div>
    </div>
  );
};

export default EmbedInstructions;