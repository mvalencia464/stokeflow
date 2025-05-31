import { useState, useEffect } from 'react';
import { Form, FormStep, Question } from '../../stores/formStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';

interface FormRendererProps {
  form: Form;
  onSubmit: (data: Record<string, any>) => void;
}

const FormRenderer = ({ form, onSubmit }: FormRendererProps) => {
  const { trackStepView, trackStepCompletion, trackStepExit } = useAnalyticsStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentStep = form.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === form.steps.length - 1;

  // Track step view when step changes
  useEffect(() => {
    if (currentStep && !submitted) {
      console.log('📊 Tracking step view:', currentStep.id, currentStep.title);
      trackStepView(form.id, currentStep.id);
    }
  }, [currentStepIndex, currentStep, form.id, trackStepView, submitted]);

  // Track step exit when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep && !submitted) {
        console.log('📊 Tracking step exit (page unload):', currentStep.id);
        trackStepExit(form.id, currentStep.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Track exit when component unmounts (if not submitted)
      if (currentStep && !submitted) {
        console.log('📊 Tracking step exit (component unmount):', currentStep.id);
        trackStepExit(form.id, currentStep.id);
      }
    };
  }, [currentStep, form.id, trackStepExit, submitted]);
  
  const validateStep = () => {
    const stepErrors: Record<string, string> = {};

    currentStep.questions.forEach(question => {
      if (question.required) {
        // Check both question.title and question.id for the value
        const value = formData[question.title] || formData[question.id];

        if (value === undefined || value === null || value === '') {
          stepErrors[question.id] = 'This field is required';
        } else if (Array.isArray(value) && value.length === 0) {
          stepErrors[question.id] = 'Please select at least one option';
        }
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      // Track step completion before moving to next step
      console.log('📊 Tracking step completion:', currentStep.id, currentStep.title);
      trackStepCompletion(form.id, currentStep.id);

      if (isLastStep) {
        handleSubmit();
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    setCurrentStepIndex(prev => prev - 1);
  };
  
  const handleChange = (questionId: string, value: any) => {
    // Find the question to get its title
    const question = form.steps.flatMap(step => step.questions).find(q => q.id === questionId);
    const questionKey = question?.title || questionId; // Use title as key, fallback to ID

    setFormData(prev => ({
      ...prev,
      [questionKey]: value
    }));

    // Clear error when user makes changes
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = () => {
    console.log('🔍 Form data before validation:', formData);
    if (validateStep()) {
      console.log('✅ Validation passed, submitting form');
      onSubmit(formData);
      setSubmitted(true);
    } else {
      console.log('❌ Validation failed, errors:', errors);
    }
  };
  
  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-slate-600 mb-6">{form.settings.thankYouMessage}</p>
        
        {form.settings.redirectUrl && (
          <p className="text-sm text-slate-500">
            Redirecting you to our website...
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Bar */}
      {form.settings.showProgressBar && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Step {currentStepIndex + 1} of {form.steps.length}</span>
            <span>{Math.round(((currentStepIndex + 1) / form.steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
            <div 
              className="h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${((currentStepIndex + 1) / form.steps.length) * 100}%`,
                backgroundColor: form.settings.primaryColor 
              }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Step Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">{currentStep.title}</h2>
        {currentStep.description && (
          <p className="text-slate-600">{currentStep.description}</p>
        )}
      </div>
      
      {/* Questions */}
      <div className="space-y-6 mb-6">
        {currentStep.questions.map(question => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={formData[question.title] || formData[question.id]} // Try title first, fallback to ID
            onChange={(value) => handleChange(question.id, value)}
            error={errors[question.id]}
            primaryColor={form.settings.primaryColor}
          />
        ))}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {!isFirstStep ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          type="button"
          className="btn"
          style={{ 
            backgroundColor: form.settings.primaryColor,
            color: 'white'
          }}
          onClick={handleNext}
        >
          {isLastStep ? 'Submit' : 'Next'}
          {!isLastStep && <ChevronRight className="h-5 w-5 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default FormRenderer;