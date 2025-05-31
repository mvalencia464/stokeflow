import { useState } from 'react';
import { 
  X, 
  Plus, 
  GripVertical, 
  Trash2 
} from 'lucide-react';
import { useFormStore, Question, Choice } from '../../stores/formStore';
import { v4 as uuidv4 } from 'uuid';

interface QuestionEditorProps {
  formId: string;
  stepId: string;
  question: Question;
  onClose: () => void;
}

const QuestionEditor = ({ formId, stepId, question, onClose }: QuestionEditorProps) => {
  const { updateQuestion, deleteQuestion } = useFormStore();
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = () => {
    updateQuestion(formId, stepId, currentQuestion);
    onClose();
  };
  
  const handleDelete = () => {
    deleteQuestion(formId, stepId, question.id);
    onClose();
  };
  
  const addChoice = () => {
    const newChoice: Choice = {
      id: uuidv4(),
      value: `option${(currentQuestion.choices?.length || 0) + 1}`,
      label: `Option ${(currentQuestion.choices?.length || 0) + 1}`,
    };
    
    if (currentQuestion.type === 'image-select') {
      newChoice.imageUrl = 'https://via.placeholder.com/150';
    }
    
    setCurrentQuestion(prev => ({
      ...prev,
      choices: [...(prev.choices || []), newChoice]
    }));
  };
  
  const updateChoice = (id: string, field: keyof Choice, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      choices: prev.choices?.map(choice => 
        choice.id === id ? { ...choice, [field]: value } : choice
      )
    }));
  };
  
  const removeChoice = (id: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      choices: prev.choices?.filter(choice => choice.id !== id)
    }));
  };
  
  const renderChoiceFields = () => {
    if (!['radio', 'checkbox', 'select', 'multi-select', 'image-select'].includes(currentQuestion.type)) return null;
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">Choices</label>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={addChoice}
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Add Choice
          </button>
        </div>
        
        <div className="space-y-2">
          {currentQuestion.choices?.map((choice, index) => (
            <div key={choice.id} className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-slate-400" />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={choice.label}
                  onChange={(e) => updateChoice(choice.id, 'label', e.target.value)}
                  className="input-field"
                  placeholder="Label"
                />
                
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) => updateChoice(choice.id, 'value', e.target.value)}
                  className="input-field"
                  placeholder="Value"
                />
                
                {currentQuestion.type === 'image-select' && (
                  <input
                    type="text"
                    value={choice.imageUrl || ''}
                    onChange={(e) => updateChoice(choice.id, 'imageUrl', e.target.value)}
                    className="input-field md:col-span-2"
                    placeholder="Image URL"
                  />
                )}
              </div>
              
              <button
                type="button"
                className="p-1 text-slate-400 hover:text-error-600 rounded"
                onClick={() => removeChoice(choice.id)}
                disabled={currentQuestion.choices!.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Edit Question</h4>
        <div className="flex space-x-1">
          <button
            className="p-1 text-slate-400 hover:text-error-600 rounded"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">Question Text</label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentQuestion.title}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter your question"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="form-label">Question Type</label>
            <select
              id="type"
              name="type"
              value={currentQuestion.type}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="text">Text Field</option>
              <option value="textarea">Text Area</option>
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkboxes</option>
              <option value="select">Dropdown</option>
              <option value="multi-select">Multi-Select</option>
              <option value="image-select">Image Selection</option>
              <option value="date">Date Picker</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="placeholder" className="form-label">Placeholder Text</label>
            <input
              type="text"
              id="placeholder"
              name="placeholder"
              value={currentQuestion.placeholder || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter placeholder text"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="helpText" className="form-label">Help Text (Optional)</label>
          <input
            type="text"
            id="helpText"
            name="helpText"
            value={currentQuestion.helpText || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Additional information to help users"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            name="required"
            checked={currentQuestion.required}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-slate-700">
            Required Question
          </label>
        </div>
        
        {renderChoiceFields()}
        
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;