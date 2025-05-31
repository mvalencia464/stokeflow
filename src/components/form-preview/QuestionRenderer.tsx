import { Question } from '../../stores/formStore';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  primaryColor: string;
}

const QuestionRenderer = ({ question, value, onChange, error, primaryColor }: QuestionRendererProps) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, choiceValue: string) => {
    const isChecked = e.target.checked;
    const currentValues = Array.isArray(value) ? value : [];
    
    if (isChecked) {
      onChange([...currentValues, choiceValue]);
    } else {
      onChange(currentValues.filter(v => v !== choiceValue));
    }
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };
  
  const handleImageSelectChange = (choiceValue: string) => {
    onChange(choiceValue);
  };
  
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className="input-field"
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            rows={4}
            className="input-field"
          />
        );
        
      case 'radio':
        return (
          <div className="space-y-2 mt-1">
            {question.choices?.map(choice => (
              <div key={choice.id} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${choice.id}`}
                  name={question.id}
                  value={choice.value}
                  checked={value === choice.value}
                  onChange={handleRadioChange}
                  className="h-4 w-4 focus:ring-2"
                  style={{ 
                    color: primaryColor,
                    borderColor: '#cbd5e1'
                  }}
                />
                <label 
                  htmlFor={`${question.id}-${choice.id}`} 
                  className="ml-2 block text-sm text-slate-700"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-2 mt-1">
            {question.choices?.map(choice => (
              <div key={choice.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.id}-${choice.id}`}
                  name={`${question.id}-${choice.id}`}
                  value={choice.value}
                  checked={Array.isArray(value) ? value.includes(choice.value) : false}
                  onChange={(e) => handleCheckboxChange(e, choice.value)}
                  className="h-4 w-4 rounded focus:ring-2"
                  style={{ 
                    color: primaryColor,
                    borderColor: '#cbd5e1'
                  }}
                />
                <label 
                  htmlFor={`${question.id}-${choice.id}`} 
                  className="ml-2 block text-sm text-slate-700"
                >
                  {choice.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={handleSelectChange}
            className="input-field"
          >
            <option value="">Select an option</option>
            {question.choices?.map(choice => (
              <option key={choice.id} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        );

      case 'multi-select':
        return (
          <select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={handleMultiSelectChange}
            className="input-field min-h-[120px]"
            size={Math.min(question.choices?.length || 3, 6)}
          >
            {question.choices?.map(choice => (
              <option key={choice.id} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        );
        
      case 'image-select':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
            {question.choices?.map(choice => (
              <div 
                key={choice.id} 
                className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                  value === choice.value 
                    ? `border-opacity-100 shadow-md` 
                    : 'border-slate-200 border-opacity-50'
                }`}
                style={{
                  borderColor: value === choice.value ? primaryColor : undefined
                }}
                onClick={() => handleImageSelectChange(choice.value)}
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  {choice.imageUrl && (
                    <img 
                      src={choice.imageUrl} 
                      alt={choice.label}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2 text-center">
                  <span className="text-sm font-medium">{choice.label}</span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={handleTextChange}
            className="input-field"
          />
        );
        
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
  return (
    <div className="form-control">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {question.title}
        {question.required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      {question.helpText && (
        <p className="text-xs text-slate-500 mb-1">{question.helpText}</p>
      )}
      
      {renderQuestionInput()}
      
      {error && (
        <p className="mt-1 text-xs text-error-600">{error}</p>
      )}
    </div>
  );
};

export default QuestionRenderer;