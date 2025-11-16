import React, { useState, useEffect, useMemo } from 'react';
import type { Policy, Form, FormAnswers, AppStatus, CompanyProfile } from '../types';
import { LoadingIcon, TipIcon, InfoIcon } from './Icons';
import { explainPolicyTypeStream, explainFormTypeStream } from '../services/geminiService';
import ExplainPolicyModal from './ExplainPolicyModal';

interface QuestionnaireProps {
  item: Policy | Form;
  companyProfile: CompanyProfile;
  answers: FormAnswers;
  onAnswersChange: (answers: FormAnswers) => void;
  onGenerate: () => void;
  status: AppStatus;
}

const COMPANY_VOICES = [
  'Formal & Corporate',
  'Modern & Friendly',
  'Direct & No-Nonsense',
];

const Questionnaire: React.FC<QuestionnaireProps> = ({
  item,
  companyProfile,
  answers,
  onAnswersChange,
  onGenerate,
  status,
}) => {
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [explanationStatus, setExplanationStatus] = useState<AppStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isPolicy = item.kind === 'policy';

  useEffect(() => {
    if (isPolicy && !answers.companyVoice) {
      onAnswersChange({ ...answers, companyVoice: COMPANY_VOICES[0] });
    }
    // Clear errors when item changes
    setErrors({});
  }, [item.type]);

  const validateField = (id: string, value: any): boolean => {
    const question = item.questions.find(q => q.id === id);
    if (!question) return true;

    // Skip validation for conditional fields that are not shown
    if (question.conditional && !question.conditional(answers)) {
        // Clear any previous error for this field
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
        return true;
    }

    let error = '';
    if (question.required && (!value || (typeof value === 'string' && !value.trim()))) {
        error = `${question.label} is required.`;
    } else if (question.type === 'number' && value && isNaN(Number(value))) {
        error = 'Please enter a valid number.';
    }

    setErrors(prev => ({ ...prev, [id]: error }));
    return !error;
  };
  
  const isFormInvalid = useMemo(() => {
    // Immediately invalid if there's an active error message from user interaction
    if (Object.values(errors).some(e => !!e)) {
        return true;
    }

    // Proactively check for empty required fields, even before interaction
    for (const q of item.questions) {
        const isVisible = !q.conditional || q.conditional(answers);
        if (isVisible && q.required) {
            const value = answers[q.id];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return true; // Form is invalid if a visible required field is empty
            }
        }
    }

    return false; // If all checks pass, the form is valid
  }, [answers, errors, item.questions]);


  const handleInputChange = (id: string, value: string) => {
    const newAnswers = { ...answers, [id]: value };
    if (id === 'effectiveDate' && value) {
        const parts = value.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            if (!isNaN(year)) {
                newAnswers['reviewDate'] = `${year + 1}-${parts[1]}-${parts[2]}`;
            }
        }
    }

    onAnswersChange(newAnswers);
    validateField(id, value);
  };

  const handleCheckboxChange = (questionId: string, optionId: string, isChecked: boolean) => {
    const question = item.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const currentSelection = answers[questionId] || {};
    let newSelection = { ...currentSelection };

    if (optionId === 'select-all') {
        // If 'select-all' is clicked, update all options accordingly
        newSelection = {}; // Reset selection
        question.options.forEach(opt => {
            newSelection[opt.id] = isChecked;
        });
    } else {
        // If an individual option is clicked, update it
        newSelection[optionId] = isChecked;
        
        // Then, determine the state of 'select-all'
        const allOtherOptions = question.options.filter(opt => opt.id !== 'select-all');
        const allOthersChecked = allOtherOptions.every(opt => newSelection[opt.id]);
        newSelection['select-all'] = allOthersChecked;
    }

    onAnswersChange({ ...answers, [questionId]: newSelection });
  };
  
  const handleExplain = async () => {
    setExplanation('');
    setExplanationStatus('loading');
    setIsExplainModalOpen(true);

    try {
      const stream = item.kind === 'policy'
        ? explainPolicyTypeStream(item.title)
        : explainFormTypeStream(item.title);
        
      for await (const chunk of stream) {
        setExplanation((prev) => prev + chunk);
      }
      setExplanationStatus('success');
    } catch (error) {
      console.error('Failed to explain item:', error);
      setExplanationStatus('error');
    }
  };

  const handleGenerateClick = () => {
    // Run validation for all fields to display any remaining error messages
    const allValid = item.questions
        .map(q => validateField(q.id, answers[q.id]))
        .every(isValid => isValid);

    if (allValid) {
        onGenerate();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-1">
        <div>
            <h2 className="text-2xl font-bold text-secondary">{item.title} Questionnaire</h2>
            <div className="text-sm text-gray-500 mt-1">
                Customizing for: <span className="font-semibold text-secondary">{companyProfile.companyName}</span> 
                {isPolicy && ` (${companyProfile.industry})`}
            </div>
        </div>
        <button 
          onClick={handleExplain} 
          className="flex-shrink-0 flex items-center text-sm text-primary font-semibold hover:underline" 
          title={`What is this ${item.kind}?`}
        >
          <InfoIcon className="w-5 h-5 mr-1" />
          Explain this {item.kind}
        </button>
      </div>
      <p className="text-gray-500 mb-6 mt-4">Answer the questions below to customize your document.</p>
      
      {isPolicy && (
        <div className="space-y-2 mb-6">
          <label htmlFor="companyVoice" className="block text-sm font-medium text-gray-700">Company Voice</label>
          <select
            id="companyVoice"
            name="companyVoice"
            value={answers.companyVoice || ''}
            onChange={(e) => handleInputChange('companyVoice', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
          >
            {COMPANY_VOICES.map((voice) => (
              <option key={voice} value={voice}>{voice}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Select the tone you want your policy to have.</p>
        </div>
      )}

      <div className="space-y-6">
        {item.questions.map((q) => {
            if (q.id === 'companyName') return null;

            if (q.conditional && !q.conditional(answers)) {
                return null;
            }
            
            const isReviewDate = q.id === 'reviewDate';

            if (q.type === 'checkbox') {
              return (
                <div key={q.id}>
                  <fieldset>
                     <div className="relative flex items-center group w-fit">
                        <legend className="block text-sm font-medium text-gray-700">{q.label}</legend>
                        {q.tip && (
                           <div className="relative flex items-center group ml-2">
                                <InfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-3 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible pointer-events-none z-10">
                                    {q.tip}
                                    <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-2 space-y-2 border border-gray-200 rounded-md p-4">
                      {q.options?.map((option, index) => {
                        const isSelectAll = option.id === 'select-all';
                        const showSeparator = isSelectAll && index === 0 && q.options && q.options.length > 1;

                        return (
                            <React.Fragment key={option.id}>
                                <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                    id={`${q.id}-${option.id}`}
                                    name={`${q.id}-${option.id}`}
                                    type="checkbox"
                                    checked={answers[q.id]?.[option.id] || false}
                                    onChange={(e) => handleCheckboxChange(q.id, option.id, e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                    <label htmlFor={`${q.id}-${option.id}`} className={`font-medium ${isSelectAll ? 'text-primary' : 'text-gray-900'}`}>
                                    {option.label}
                                    </label>
                                </div>
                                </div>
                                {showSeparator && <hr className="my-2 border-gray-200" />}
                            </React.Fragment>
                        )
                      })}
                    </div>
                  </fieldset>
                </div>
              );
            }

          return (
            <div key={q.id} className="space-y-2">
                 <div className="flex items-center">
                    <label htmlFor={q.id} className="block text-sm font-medium text-gray-700">{q.label}</label>
                    {q.tip && (
                        <div className="relative flex items-center group ml-2">
                            <InfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-3 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible pointer-events-none z-10">
                                {q.tip}
                                <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
              {q.type === 'textarea' ? (
                <textarea
                  id={q.id}
                  name={q.id}
                  rows={3}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  onBlur={(e) => validateField(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors[q.id] ? 'border-red-500' : 'border-gray-300'}`}
                />
              ) : (
                <input
                  id={q.id}
                  name={q.id}
                  type={q.type}
                  readOnly={isReviewDate}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  onBlur={(e) => validateField(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors[q.id] ? 'border-red-500' : 'border-gray-300'} ${isReviewDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              )}
               {errors[q.id] && <p className="text-red-600 text-xs mt-1">{errors[q.id]}</p>}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isFormInvalid}
        className="mt-8 w-full bg-primary text-white font-bold py-4 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        Continue to Finalize
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <ExplainPolicyModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        explanationText={explanation}
        status={explanationStatus}
        itemType={item.kind}
      />
    </div>
  );
};

export default Questionnaire;