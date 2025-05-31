import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'multi-select'
  | 'image-select'
  | 'date';

export interface Choice {
  id: string;
  value: string;
  label: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  choices?: Choice[];
  conditionalLogic?: {
    questionId: string;
    operator: 'equals' | 'not_equals';
    value: string;
  };
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  steps: FormStep[];
  settings: {
    primaryColor: string;
    logoUrl?: string;
    redirectUrl?: string;
    showProgressBar: boolean;
    thankYouMessage: string;
  };
}

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  createForm: (name: string, description?: string) => string;
  createFormFromTemplate: (template: Form) => string;
  duplicateForm: (id: string) => string | null;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  getForm: (id: string) => Form | null;
  setCurrentForm: (id: string | null) => void;
  addStep: (formId: string) => void;
  updateStep: (formId: string, step: FormStep) => void;
  deleteStep: (formId: string, stepId: string) => void;
  addQuestion: (formId: string, stepId: string, type: QuestionType) => void;
  duplicateQuestion: (formId: string, stepId: string, questionId: string) => void;
  updateQuestion: (formId: string, stepId: string, question: Question) => void;
  deleteQuestion: (formId: string, stepId: string, questionId: string) => void;
  reorderQuestions: (formId: string, stepId: string, questionIds: string[]) => void;
  reorderSteps: (formId: string, stepIds: string[]) => void;
}

const TEST_FORM: Form = {
  id: 'test-highlevel',
  name: 'HighLevel Test Form',
  description: 'Testing HighLevel integration',
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [
    {
      id: 's1',
      title: 'Contact Information',
      description: 'Please provide your contact details',
      questions: [
        {
          id: 'q1',
          type: 'text',
          title: 'Full Name',
          placeholder: 'John Doe',
          required: true,
        },
        {
          id: 'q2',
          type: 'text',
          title: 'Email Address',
          placeholder: 'john@example.com',
          required: true,
        },
        {
          id: 'q3',
          type: 'text',
          title: 'Phone Number',
          placeholder: '+1 (555) 123-4567',
          required: true,
        }
      ],
    },
    {
      id: 's2',
      title: 'Additional Information',
      questions: [
        {
          id: 'q4',
          type: 'select',
          title: 'Interested Service',
          required: true,
          choices: [
            { id: 'c1', value: 'consultation', label: 'Free Consultation' },
            { id: 'c2', value: 'audit', label: 'Business Audit' },
            { id: 'c3', value: 'coaching', label: 'Business Coaching' }
          ]
        },
        {
          id: 'q5',
          type: 'textarea',
          title: 'Message',
          placeholder: 'Tell us more about your needs...',
          required: false,
        }
      ],
    }
  ],
  settings: {
    primaryColor: '#3B82F6',
    showProgressBar: true,
    thankYouMessage: 'Thanks! We\'ll be in touch soon.',
  }
};

// Modern Lead Generation Template - Similar to the design in your image
const MODERN_LEAD_TEMPLATE: Form = {
  id: 'modern-lead-template',
  name: 'Modern Lead Generation Form',
  description: 'Clean, professional multi-step form for lead generation',
  createdAt: new Date(),
  updatedAt: new Date(),
  steps: [
    {
      id: 'step1',
      title: 'What\'s the location of the collection?',
      description: 'Help us understand where you need our services',
      questions: [
        {
          id: 'location',
          type: 'text',
          title: 'Enter your address or location',
          placeholder: 'e.g., 123 Main Street, City, State',
          required: true,
        }
      ],
    },
    {
      id: 'step2',
      title: 'What do you need to get rid of?',
      description: 'Select all items that apply to your collection needs',
      questions: [
        {
          id: 'items',
          type: 'checkbox',
          title: 'Select the items you need collected',
          required: true,
          choices: [
            { id: 'furniture', value: 'furniture', label: 'Furniture' },
            { id: 'appliances', value: 'appliances', label: 'Appliances' },
            { id: 'electronics', value: 'electronics', label: 'Electronics' },
            { id: 'construction', value: 'construction', label: 'Construction Debris' },
            { id: 'yard-waste', value: 'yard-waste', label: 'Yard Waste' },
            { id: 'other', value: 'other', label: 'Other Items' }
          ]
        }
      ],
    },
    {
      id: 'step3',
      title: 'What\'s your biggest load size?',
      description: 'This helps us determine the right truck and pricing',
      questions: [
        {
          id: 'load-size',
          type: 'radio',
          title: 'Estimated load size',
          required: true,
          choices: [
            { id: 'small', value: 'small', label: 'Small Load (1-2 items)' },
            { id: 'medium', value: 'medium', label: 'Medium Load (3-8 items)' },
            { id: 'large', value: 'large', label: 'Large Load (9+ items)' },
            { id: 'full-truck', value: 'full-truck', label: 'Full Truck Load' }
          ]
        }
      ],
    },
    {
      id: 'step4',
      title: 'When do you need the collection?',
      description: 'Select your preferred date and time',
      questions: [
        {
          id: 'collection-date',
          type: 'date',
          title: 'Preferred collection date',
          required: true,
        },
        {
          id: 'time-preference',
          type: 'radio',
          title: 'Time preference',
          required: true,
          choices: [
            { id: 'morning', value: 'morning', label: 'Morning (8AM - 12PM)' },
            { id: 'afternoon', value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
            { id: 'flexible', value: 'flexible', label: 'I\'m flexible' }
          ]
        }
      ],
    },
    {
      id: 'step5',
      title: 'Select your preferred truck type',
      description: 'Choose the truck that best fits your needs',
      questions: [
        {
          id: 'truck-type',
          type: 'image-select',
          title: 'Truck Type',
          required: true,
          choices: [
            {
              id: 'pickup',
              value: 'pickup',
              label: 'Pickup Truck',
              imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop&crop=center'
            },
            {
              id: 'box-truck',
              value: 'box-truck',
              label: 'Box Truck',
              imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=150&fit=crop&crop=center'
            },
            {
              id: 'large-truck',
              value: 'large-truck',
              label: 'Large Truck',
              imageUrl: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=200&h=150&fit=crop&crop=center'
            }
          ]
        }
      ],
    },
    {
      id: 'step6',
      title: 'Where is the waste located?',
      description: 'This helps our team prepare for the collection',
      questions: [
        {
          id: 'waste-location',
          type: 'select',
          title: 'Location of items',
          required: true,
          choices: [
            { id: 'curbside', value: 'curbside', label: 'Curbside/Street' },
            { id: 'driveway', value: 'driveway', label: 'Driveway' },
            { id: 'garage', value: 'garage', label: 'Garage' },
            { id: 'backyard', value: 'backyard', label: 'Backyard' },
            { id: 'inside-home', value: 'inside-home', label: 'Inside Home' },
            { id: 'basement', value: 'basement', label: 'Basement/Attic' }
          ]
        }
      ],
    },
    {
      id: 'step7',
      title: 'Contact Information',
      description: 'We\'ll use this to confirm your booking and provide updates',
      questions: [
        {
          id: 'full-name',
          type: 'text',
          title: 'Full Name',
          placeholder: 'John Smith',
          required: true,
        },
        {
          id: 'email',
          type: 'text',
          title: 'Email Address',
          placeholder: 'john@example.com',
          required: true,
        },
        {
          id: 'phone',
          type: 'text',
          title: 'Phone Number',
          placeholder: '(555) 123-4567',
          required: true,
        }
      ],
    },
    {
      id: 'step8',
      title: 'Additional Details',
      description: 'Any special instructions or additional information',
      questions: [
        {
          id: 'special-instructions',
          type: 'textarea',
          title: 'Special Instructions (Optional)',
          placeholder: 'Any specific instructions for our team, access codes, or additional details...',
          required: false,
        },
        {
          id: 'how-did-you-hear',
          type: 'select',
          title: 'How did you hear about us?',
          required: false,
          choices: [
            { id: 'google', value: 'google', label: 'Google Search' },
            { id: 'social-media', value: 'social-media', label: 'Social Media' },
            { id: 'referral', value: 'referral', label: 'Friend/Family Referral' },
            { id: 'advertisement', value: 'advertisement', label: 'Advertisement' },
            { id: 'other', value: 'other', label: 'Other' }
          ]
        }
      ],
    }
  ],
  settings: {
    primaryColor: '#10B981', // Green color similar to the image
    showProgressBar: true,
    thankYouMessage: 'Thank you! We\'ll contact you within 24 hours to confirm your booking.',
  }
};

const MOCK_FORMS: Form[] = [TEST_FORM, MODERN_LEAD_TEMPLATE];

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      forms: MOCK_FORMS,
      currentForm: null,

  createForm: (name, description) => {
    const id = uuidv4();
    const newForm: Form = {
      id,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: uuidv4(),
          title: 'Step 1',
          questions: [],
        }
      ],
      settings: {
        primaryColor: '#3B82F6',
        showProgressBar: true,
        thankYouMessage: 'Thank you for your submission!',
      }
    };

    set(state => ({
      forms: [...state.forms, newForm],
      currentForm: newForm,
    }));

    return id;
  },

  createFormFromTemplate: (template) => {
    const newForm: Form = {
      ...template,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: template.steps.map(step => ({
        ...step,
        id: uuidv4(),
        questions: step.questions.map(question => ({
          ...question,
          id: uuidv4(),
          choices: question.choices?.map(choice => ({
            ...choice,
            id: uuidv4(),
          })),
        })),
      })),
    };

    set(state => ({
      forms: [...state.forms, newForm],
      currentForm: newForm,
    }));

    return newForm.id;
  },

  updateForm: (form) => {
    set(state => ({
      forms: state.forms.map(f => f.id === form.id ? { ...form, updatedAt: new Date() } : f),
      currentForm: state.currentForm?.id === form.id ? { ...form, updatedAt: new Date() } : state.currentForm,
    }));
  },

  deleteForm: (id) => {
    set(state => ({
      forms: state.forms.filter(f => f.id !== id),
      currentForm: state.currentForm?.id === id ? null : state.currentForm,
    }));
  },

  getForm: (id) => {
    return get().forms.find(f => f.id === id) || null;
  },

  setCurrentForm: (id) => {
    if (id === null) {
      set({ currentForm: null });
      return;
    }

    const form = get().forms.find(f => f.id === id) || null;
    set({ currentForm: form });
  },

  addStep: (formId) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const newStep: FormStep = {
      id: uuidv4(),
      title: `Step ${form.steps.length + 1}`,
      questions: [],
    };

    const updatedForm = {
      ...form,
      steps: [...form.steps, newStep],
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  updateStep: (formId, step) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const updatedForm = {
      ...form,
      steps: form.steps.map(s => s.id === step.id ? step : s),
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  deleteStep: (formId, stepId) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form || form.steps.length <= 1) return; // Don't delete the last step

    const updatedForm = {
      ...form,
      steps: form.steps.filter(s => s.id !== stepId),
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  addQuestion: (formId, stepId, type) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const stepIndex = form.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: 'New Question',
      required: false,
    };

    // Add default choices for choice-based questions
    if (['radio', 'checkbox', 'select', 'multi-select', 'image-select'].includes(type)) {
      newQuestion.choices = [
        { id: uuidv4(), value: 'option1', label: 'Option 1' },
        { id: uuidv4(), value: 'option2', label: 'Option 2' },
      ];

      if (type === 'image-select') {
        newQuestion.choices.forEach(choice => {
          choice.imageUrl = 'https://via.placeholder.com/150';
        });
      }
    }

    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      questions: [...updatedSteps[stepIndex].questions, newQuestion],
    };

    const updatedForm = {
      ...form,
      steps: updatedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  updateQuestion: (formId, stepId, question) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const stepIndex = form.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      questions: updatedSteps[stepIndex].questions.map(q => 
        q.id === question.id ? question : q
      ),
    };

    const updatedForm = {
      ...form,
      steps: updatedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  deleteQuestion: (formId, stepId, questionId) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const stepIndex = form.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      questions: updatedSteps[stepIndex].questions.filter(q => q.id !== questionId),
    };

    const updatedForm = {
      ...form,
      steps: updatedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  duplicateForm: (id) => {
    const form = get().forms.find(f => f.id === id);
    if (!form) return null;

    const newId = uuidv4();
    const duplicatedForm: Form = {
      ...form,
      id: newId,
      name: `${form.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: form.steps.map(step => ({
        ...step,
        id: uuidv4(),
        questions: step.questions.map(question => ({
          ...question,
          id: uuidv4(),
          choices: question.choices?.map(choice => ({
            ...choice,
            id: uuidv4(),
          })),
        })),
      })),
    };

    set(state => ({
      forms: [...state.forms, duplicatedForm],
    }));

    return newId;
  },

  duplicateQuestion: (formId, stepId, questionId) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const stepIndex = form.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const questionIndex = form.steps[stepIndex].questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const originalQuestion = form.steps[stepIndex].questions[questionIndex];
    const duplicatedQuestion: Question = {
      ...originalQuestion,
      id: uuidv4(),
      title: `${originalQuestion.title} (Copy)`,
      choices: originalQuestion.choices?.map(choice => ({
        ...choice,
        id: uuidv4(),
      })),
    };

    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      questions: [
        ...updatedSteps[stepIndex].questions.slice(0, questionIndex + 1),
        duplicatedQuestion,
        ...updatedSteps[stepIndex].questions.slice(questionIndex + 1),
      ],
    };

    const updatedForm = {
      ...form,
      steps: updatedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  reorderQuestions: (formId, stepId, questionIds) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const stepIndex = form.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const currentQuestions = form.steps[stepIndex].questions;
    const reorderedQuestions = questionIds.map(id =>
      currentQuestions.find(q => q.id === id)
    ).filter(Boolean) as Question[];

    const updatedSteps = [...form.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      questions: reorderedQuestions,
    };

    const updatedForm = {
      ...form,
      steps: updatedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },

  reorderSteps: (formId, stepIds) => {
    const form = get().forms.find(f => f.id === formId);
    if (!form) return;

    const reorderedSteps = stepIds.map(id =>
      form.steps.find(s => s.id === id)
    ).filter(Boolean) as FormStep[];

    const updatedForm = {
      ...form,
      steps: reorderedSteps,
      updatedAt: new Date(),
    };

    set(state => ({
      forms: state.forms.map(f => f.id === formId ? updatedForm : f),
      currentForm: state.currentForm?.id === formId ? updatedForm : state.currentForm,
    }));
  },
    }),
    {
      name: 'forms-storage', // localStorage key
      partialize: (state) => ({
        forms: state.forms,
        currentForm: state.currentForm
      }), // Persist forms and current form
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects when loading from localStorage
        if (state?.forms) {
          state.forms = state.forms.map(form => ({
            ...form,
            createdAt: new Date(form.createdAt),
            updatedAt: new Date(form.updatedAt)
          }));
        }
        if (state?.currentForm) {
          state.currentForm = {
            ...state.currentForm,
            createdAt: new Date(state.currentForm.createdAt),
            updatedAt: new Date(state.currentForm.updatedAt)
          };
        }
      },
    }
  )
);