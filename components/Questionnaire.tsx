
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

  const isGenerateDisabled = status === 'loading';

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
            // Skip companyName as it's now in the profile
            if (q.id === 'companyName') return null;

            if (q.conditional && !q.conditional(answers)) {
                return null;
            }

          return (
            <div key={q.id} className="space-y-2">
              <label htmlFor={q.id} className="block text-sm font-medium text-gray-700">{q.label}</label>
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
              {q.tip && (
                <div className="flex items-start text-xs text-gray-500 mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <TipIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-accent"/>
                  <span>{q.tip}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled}
        className="mt-8 w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {status === 'loading' ? (
          <>
            <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating...
          </>
        ) : (
          'Generate My Document'
        )}
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
