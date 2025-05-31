import { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Settings as SettingsIcon,
  Copy
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormStore, FormStep, Question, QuestionType } from '../../stores/formStore';
import QuestionEditor from './QuestionEditor';
import FormSettings from './FormSettings';

interface FormEditorProps {
  formId: string;
}

interface SortableQuestionProps {
  question: Question;
  isActive: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
}

interface SortableStepProps {
  step: FormStep;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

const SortableStep = ({ step, index, isActive, onClick, onDelete, canDelete }: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <button
        className={`w-full text-left p-3 rounded-lg border transition-colors ${
          isActive
            ? 'bg-primary-50 border-primary-200 text-primary-900'
            : 'bg-white border-slate-200 hover:bg-slate-50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded mr-2"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{step.title || `Step ${index + 1}`}</span>
              <span className="ml-2 text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                {step.questions.length} {step.questions.length === 1 ? 'question' : 'questions'}
              </span>
            </div>
            {step.description && (
              <p className="text-xs text-slate-500 mt-1 truncate">{step.description}</p>
            )}
          </div>
          <div className="flex">
            {canDelete && (
              <button
                className="p-1 text-slate-400 hover:text-error-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </button>
    </li>
  );
};

const SortableQuestion = ({ question, isActive, onEdit, onDuplicate }: SortableQuestionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg ${
        isActive
          ? 'border-primary-500 ring-1 ring-primary-500'
          : 'border-slate-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{question.title || 'Untitled Question'}</div>
              <div className="text-xs text-slate-500 mt-1">
                {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                {question.required && <span className="ml-2 text-error-600">*Required</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              className="p-1 text-slate-400 hover:text-primary-600 rounded"
              onClick={onDuplicate}
              title="Duplicate question"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              className="p-1 text-slate-400 hover:text-primary-600 rounded"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormEditor = ({ formId }: FormEditorProps) => {
  const { getForm, addStep, updateStep, deleteStep, addQuestion, duplicateQuestion, reorderQuestions, reorderSteps } = useFormStore();
  const form = getForm(formId);
  
  const [activeStep, setActiveStep] = useState<string | null>(form?.steps[0]?.id || null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!form) return null;

  const handleAddStep = () => {
    addStep(formId);
  };
  
  const handleStepUpdate = (step: FormStep) => {
    updateStep(formId, step);
  };
  
  const handleDeleteStep = (stepId: string) => {
    deleteStep(formId, stepId);
    if (activeStep === stepId) {
      setActiveStep(form.steps.find(s => s.id !== stepId)?.id || null);
    }
  };
  
  const handleAddQuestion = (stepId: string, type: QuestionType) => {
    addQuestion(formId, stepId, type);
  };

  const handleDuplicateQuestion = (stepId: string, questionId: string) => {
    duplicateQuestion(formId, stepId, questionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Check if we're dragging steps
    const isStepDrag = form.steps.some(step => step.id === active.id);

    if (isStepDrag) {
      const oldIndex = form.steps.findIndex(s => s.id === active.id);
      const newIndex = form.steps.findIndex(s => s.id === over.id);

      const newStepIds = arrayMove(
        form.steps.map(s => s.id),
        oldIndex,
        newIndex
      );

      reorderSteps(formId, newStepIds);
    } else {
      // Handle question reordering
      const currentStep = getActiveStep();
      if (!currentStep) return;

      const oldIndex = currentStep.questions.findIndex(q => q.id === active.id);
      const newIndex = currentStep.questions.findIndex(q => q.id === over.id);

      const newQuestionIds = arrayMove(
        currentStep.questions.map(q => q.id),
        oldIndex,
        newIndex
      );

      reorderQuestions(formId, currentStep.id, newQuestionIds);
    }
  };
  
  const getActiveStep = () => {
    return form.steps.find(step => step.id === activeStep) || null;
  };
  
  const getQuestionTypes = () => [
    { type: 'text', label: 'Text Field' },
    { type: 'textarea', label: 'Text Area' },
    { type: 'radio', label: 'Radio Buttons' },
    { type: 'checkbox', label: 'Checkboxes' },
    { type: 'select', label: 'Dropdown' },
    { type: 'multi-select', label: 'Multi-Select' },
    { type: 'image-select', label: 'Image Selection' },
    { type: 'date', label: 'Date Picker' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Steps */}
      <div className="card p-4 h-fit lg:sticky lg:top-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Form Structure</h3>
          <button 
            className="p-1 text-slate-500 hover:text-primary-600 rounded hover:bg-slate-100"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
        
        {showSettings ? (
          <FormSettings 
            form={form} 
            onClose={() => setShowSettings(false)} 
          />
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={form.steps.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2 mb-4">
                  {form.steps.map((step, index) => (
                    <SortableStep
                      key={step.id}
                      step={step}
                      index={index}
                      isActive={activeStep === step.id}
                      onClick={() => {
                        setActiveStep(step.id);
                        setActiveQuestion(null);
                      }}
                      onDelete={() => handleDeleteStep(step.id)}
                      canDelete={form.steps.length > 1}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            
            <button
              className="w-full py-2 border border-dashed border-slate-300 rounded text-slate-500 hover:text-primary-600 hover:border-primary-400 flex items-center justify-center"
              onClick={handleAddStep}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </button>
          </>
        )}
      </div>

      {/* Main Editing Area */}
      <div className="lg:col-span-2 space-y-6">
        {activeStep ? (
          <>
            {/* Step Settings */}
            <div className="card p-5">
              <h3 className="font-medium mb-4">Step Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="stepTitle" className="form-label">Step Title</label>
                  <input
                    type="text"
                    id="stepTitle"
                    className="input-field"
                    placeholder="Enter step title"
                    value={getActiveStep()?.title || ''}
                    onChange={(e) => {
                      const step = getActiveStep();
                      if (step) {
                        handleStepUpdate({ ...step, title: e.target.value });
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="stepDescription" className="form-label">Description (Optional)</label>
                  <textarea
                    id="stepDescription"
                    rows={3}
                    className="input-field"
                    placeholder="Add a description for this step"
                    value={getActiveStep()?.description || ''}
                    onChange={(e) => {
                      const step = getActiveStep();
                      if (step) {
                        handleStepUpdate({ ...step, description: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Questions */}
            <div className="card">
              <div className="p-5 border-b">
                <h3 className="font-medium">Questions</h3>
              </div>
              
              <div className="p-5 space-y-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={getActiveStep()?.questions.map(q => q.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {getActiveStep()?.questions.map(question => (
                      <div key={question.id}>
                        {activeQuestion === question.id ? (
                          <div className="border rounded-lg border-primary-500 ring-1 ring-primary-500">
                            <QuestionEditor
                              formId={formId}
                              stepId={activeStep}
                              question={question}
                              onClose={() => setActiveQuestion(null)}
                            />
                          </div>
                        ) : (
                          <SortableQuestion
                            question={question}
                            isActive={activeQuestion === question.id}
                            onEdit={() => setActiveQuestion(question.id)}
                            onDuplicate={() => handleDuplicateQuestion(activeStep!, question.id)}
                          />
                        )}
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
                
                {(!getActiveStep()?.questions || getActiveStep()?.questions.length === 0) && (
                  <div className="text-center py-6 border border-dashed border-slate-300 rounded-lg">
                    <Layers className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-slate-700 mb-1">No questions added yet</h4>
                    <p className="text-sm text-slate-500 mb-4">Add your first question to get started</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="relative">
                    <label className="form-label">Add Question</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {getQuestionTypes().map(({ type, label }) => (
                        <button
                          key={type}
                          className="text-left p-2 text-sm border border-slate-200 rounded hover:border-primary-400 hover:bg-primary-50 transition-colors"
                          onClick={() => handleAddQuestion(activeStep, type as QuestionType)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card p-8 text-center">
            <Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No steps available</h3>
            <p className="text-slate-500 mb-4">Create your first step to get started</p>
            <button 
              className="btn-primary mx-auto"
              onClick={handleAddStep}
            >
              <Plus className="h-5 w-5 mr-1.5" />
              Add Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEditor;