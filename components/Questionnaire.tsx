import React, { useState, useEffect } from 'react';
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
  
  const isPolicy = item.kind === 'policy';

  useEffect(() => {
    if (isPolicy && !answers.companyVoice) {
      onAnswersChange({ ...answers, companyVoice: COMPANY_VOICES[0] });
    }
  }, [item.type]);

  const handleInputChange = (id: string, value: string) => {
    onAnswersChange({ ...answers, [id]: value });
  };

  const handleCheckboxChange = (questionId: string, optionId: string, isChecked: boolean) => {
    const currentSelection = answers[questionId] || {};
    const newSelection = {
      ...currentSelection,
      [optionId]: isChecked,
    };
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
                      {q.options?.map((option) => (
                        <div key={option.id} className="relative flex items-start">
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
                            <label htmlFor={`${q.id}-${option.id}`} className="font-medium text-gray-900">
                              {option.label}
                            </label>
                          </div>
                        </div>
                      ))}
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
                  placeholder={q.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              ) : (
                <input
                  id={q.id}
                  name={q.id}
                  type={q.type}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onGenerate}
        className="mt-8 w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
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