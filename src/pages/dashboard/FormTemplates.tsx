import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Truck, Home, Building2, Users, Package } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { createRemodelTemplate } from '../../templates/remodelTemplate';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  preview: string;
  createTemplate: () => any;
}

const templates: Template[] = [
  {
    id: 'remodel-quote',
    name: 'Home Remodel Quote Request',
    description: 'Professional remodeling and moving services quote form with visual service selection',
    category: 'Business',
    icon: Truck,
    preview: 'Multi-step form with image selection for services, contact details, and project requirements',
    createTemplate: createRemodelTemplate
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Simple contact form for general inquiries',
    category: 'General',
    icon: FileText,
    preview: 'Basic contact form with name, email, subject, and message fields',
    createTemplate: () => ({
      id: '',
      name: 'Contact Form',
      description: 'Simple contact form for general inquiries',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [{
        id: '',
        title: 'Contact Information',
        questions: [
          { id: '', type: 'text', title: 'Full Name', required: true },
          { id: '', type: 'text', title: 'Email Address', required: true },
          { id: '', type: 'text', title: 'Subject', required: true },
          { id: '', type: 'textarea', title: 'Message', required: true }
        ]
      }],
      settings: {
        primaryColor: '#3B82F6',
        showProgressBar: false,
        thankYouMessage: 'Thank you for contacting us! We will get back to you soon.'
      }
    })
  },
  {
    id: 'real-estate',
    name: 'Real Estate Inquiry',
    description: 'Property inquiry form for real estate agents',
    category: 'Real Estate',
    icon: Home,
    preview: 'Property details, buyer information, and viewing preferences',
    createTemplate: () => ({
      id: '',
      name: 'Real Estate Inquiry',
      description: 'Property inquiry form for real estate agents',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [{
        id: '',
        title: 'Property Inquiry',
        questions: [
          { id: '', type: 'text', title: 'Full Name', required: true },
          { id: '', type: 'text', title: 'Email Address', required: true },
          { id: '', type: 'text', title: 'Phone Number', required: true },
          { id: '', type: 'radio', title: 'Property Type', required: true, choices: [
            { id: '', value: 'house', label: 'House' },
            { id: '', value: 'apartment', label: 'Apartment' },
            { id: '', value: 'condo', label: 'Condo' }
          ]},
          { id: '', type: 'select', title: 'Budget Range', required: true, choices: [
            { id: '', value: '0-200k', label: '$0 - $200,000' },
            { id: '', value: '200k-500k', label: '$200,000 - $500,000' },
            { id: '', value: '500k+', label: '$500,000+' }
          ]}
        ]
      }],
      settings: {
        primaryColor: '#059669',
        showProgressBar: false,
        thankYouMessage: 'Thank you for your inquiry! A real estate agent will contact you soon.'
      }
    })
  }
];

const FormTemplates = () => {
  const navigate = useNavigate();
  const { createFormFromTemplate } = useFormStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    const templateForm = template.createTemplate();
    const formId = createFormFromTemplate(templateForm);
    navigate(`/dashboard/forms/${formId}/edit`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <button 
          onClick={() => navigate('/dashboard/forms')}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Form Templates</h1>
      </div>

      <div className="mb-6">
        <p className="text-slate-600 mb-4">
          Choose from our professionally designed templates to get started quickly
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <div key={template.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {template.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    {template.preview}
                  </p>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full btn-primary text-sm"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create from Scratch Option */}
      <div className="mt-8 p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Start from Scratch
        </h3>
        <p className="text-slate-600 mb-4">
          Create a completely custom form with your own questions and design
        </p>
        <button
          onClick={() => navigate('/dashboard/forms/new')}
          className="btn-secondary"
        >
          Create Blank Form
        </button>
      </div>
    </div>
  );
};

export default FormTemplates;
