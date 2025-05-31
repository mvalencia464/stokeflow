import { v4 as uuidv4 } from 'uuid';
import { Form } from '../stores/formStore';

export const createRemodelTemplate = (): Form => {
  const formId = uuidv4();
  const step1Id = uuidv4();
  const step2Id = uuidv4();
  const step3Id = uuidv4();

  return {
    id: formId,
    name: 'Home Remodel Quote Request',
    description: 'Professional remodeling services quote form with service selection',
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: step1Id,
        title: 'I Need A Quote For...',
        description: 'Select the type of remodeling service you need',
        questions: [
          {
            id: uuidv4(),
            type: 'image-select',
            title: 'What type of remodeling service do you need?',
            required: true,
            choices: [
              {
                id: uuidv4(),
                value: 'home-removals',
                label: 'Home Removals',
                imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=center'
              },
              {
                id: uuidv4(),
                value: 'office-removals',
                label: 'Office Removals',
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop&crop=center'
              },
              {
                id: uuidv4(),
                value: 'long-distance-moves',
                label: 'Long Distance Moves',
                imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=150&h=150&fit=crop&crop=center'
              },
              {
                id: uuidv4(),
                value: 'student-moves',
                label: 'Student Moves',
                imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop&crop=center'
              },
              {
                id: uuidv4(),
                value: 'furniture-storage',
                label: 'Furniture & Storage Items',
                imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop&crop=center'
              },
              {
                id: uuidv4(),
                value: 'packing-services',
                label: 'Packing Services',
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=150&h=150&fit=crop&crop=center'
              }
            ]
          }
        ]
      },
      {
        id: step2Id,
        title: 'Project Details',
        description: 'Tell us more about your project requirements',
        questions: [
          {
            id: uuidv4(),
            type: 'text',
            title: 'What is your full name?',
            placeholder: 'Enter your full name',
            required: true
          },
          {
            id: uuidv4(),
            type: 'text',
            title: 'Email address',
            placeholder: 'your.email@example.com',
            required: true
          },
          {
            id: uuidv4(),
            type: 'text',
            title: 'Phone number',
            placeholder: '+44 7XXX XXX XXX',
            required: true
          },
          {
            id: uuidv4(),
            type: 'text',
            title: 'Current address (moving from)',
            placeholder: 'Enter your current address',
            required: true
          },
          {
            id: uuidv4(),
            type: 'text',
            title: 'Destination address (moving to)',
            placeholder: 'Enter destination address',
            required: true
          },
          {
            id: uuidv4(),
            type: 'date',
            title: 'Preferred moving date',
            required: true
          }
        ]
      },
      {
        id: step3Id,
        title: 'Additional Information',
        description: 'Help us provide you with the most accurate quote',
        questions: [
          {
            id: uuidv4(),
            type: 'radio',
            title: 'What is the size of your property?',
            required: true,
            choices: [
              { id: uuidv4(), value: '1-bedroom', label: '1 Bedroom' },
              { id: uuidv4(), value: '2-bedroom', label: '2 Bedroom' },
              { id: uuidv4(), value: '3-bedroom', label: '3 Bedroom' },
              { id: uuidv4(), value: '4-bedroom', label: '4+ Bedroom' },
              { id: uuidv4(), value: 'office-small', label: 'Small Office' },
              { id: uuidv4(), value: 'office-large', label: 'Large Office' }
            ]
          },
          {
            id: uuidv4(),
            type: 'multi-select',
            title: 'Do you need any additional services?',
            required: false,
            choices: [
              { id: uuidv4(), value: 'packing', label: 'Professional Packing' },
              { id: uuidv4(), value: 'unpacking', label: 'Unpacking Service' },
              { id: uuidv4(), value: 'storage', label: 'Temporary Storage' },
              { id: uuidv4(), value: 'insurance', label: 'Moving Insurance' },
              { id: uuidv4(), value: 'cleaning', label: 'End of Tenancy Cleaning' },
              { id: uuidv4(), value: 'assembly', label: 'Furniture Assembly/Disassembly' }
            ]
          },
          {
            id: uuidv4(),
            type: 'textarea',
            title: 'Any special requirements or items that need extra care?',
            placeholder: 'Please describe any fragile items, heavy furniture, or special requirements...',
            required: false
          },
          {
            id: uuidv4(),
            type: 'radio',
            title: 'How did you hear about us?',
            required: false,
            choices: [
              { id: uuidv4(), value: 'google', label: 'Google Search' },
              { id: uuidv4(), value: 'social-media', label: 'Social Media' },
              { id: uuidv4(), value: 'referral', label: 'Friend/Family Referral' },
              { id: uuidv4(), value: 'advertisement', label: 'Advertisement' },
              { id: uuidv4(), value: 'other', label: 'Other' }
            ]
          }
        ]
      }
    ],
    settings: {
      primaryColor: '#DC2626', // Red color matching the image
      showProgressBar: true,
      thankYouMessage: 'Thank you for your quote request! We will contact you within 24 hours with a detailed quote for your moving needs.',
      redirectUrl: ''
    }
  };
};
