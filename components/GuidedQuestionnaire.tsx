
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Policy, Form, FormAnswers, CompanyProfile, Question } from '../types';
import { InfoIcon, EditIcon } from './Icons';

interface GuidedQuestionnaireProps {
  item: Policy | Form;
  companyProfile: CompanyProfile;
  initialAnswers: FormAnswers;
  onAnswersChange: (answers: FormAnswers) => void;
  onGenerate: () => void;
}

const GuidedQuestionnaire: React.FC<GuidedQuestionnaireProps> = ({
  item,
  companyProfile,
  initialAnswers,
  onAnswersChange,
  onGenerate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [returnToReview, setReturnToReview] = useState(false);

  const isPolicy = item.kind === 'policy';
  const visibleQuestions = useMemo(() => item.questions.filter(q => q.id !== 'companyName' && (!q.conditional || q.conditional(answers))), [item.questions, answers]);
  const currentQuestion = visibleQuestions[currentIndex];

  useEffect(() => {
    // Merge initial answers. If companyVoice is not set in 'answers' but exists in profile, use profile.
    const defaultAnswers = { ...initialAnswers };
    if (!defaultAnswers.companyVoice && companyProfile.companyVoice) {
      defaultAnswers.companyVoice = companyProfile.companyVoice;
    }
    setAnswers(defaultAnswers);
  }, [item.type, isPolicy, initialAnswers, companyProfile.companyVoice]);

  const validateField = (question: Question | undefined, value: any): boolean => {
    if (!question) return true;
    let error = '';
    if (question.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = `${question.label} is required.`;
    } else if (question.type === 'number' && value && isNaN(Number(value))) {
      error = 'Please enter a valid number.';
    }
    setErrors(prev => ({ ...prev, [question.id]: error }));
    return !error;
  };

  const handleAnswersUpdate = (newAnswers: FormAnswers) => {
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

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
    handleAnswersUpdate(newAnswers);
    if (errors[id]) {
      validateField(currentQuestion, value);
    }
  };

  const handleCheckboxChange = (questionId: string, optionId: string, isChecked: boolean) => {
    const question = visibleQuestions.find(q => q.id === questionId);
    if (!question || !question.options) return;
    const currentSelection = answers[questionId] || {};
    let newSelection = { ...currentSelection };
    if (optionId === 'select-all') {
      newSelection = {};
      question.options.forEach(opt => { newSelection[opt.id] = isChecked; });
    } else {
      newSelection[optionId] = isChecked;
      const allOthers = question.options.filter(opt => opt.id !== 'select-all');
      newSelection['select-all'] = allOthers.every(opt => newSelection[opt.id]);
    }
    handleAnswersUpdate({ ...answers, [questionId]: newSelection });
  };

  const handleNext = () => {
    if (validateField(currentQuestion, answers[currentQuestion.id])) {
      if (returnToReview) {
        setIsReviewing(true);
        setReturnToReview(false);
      } else if (currentIndex < visibleQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsReviewing(true);
      }
    }
  };

  const handleBack = () => {
    if (returnToReview) {
      setIsReviewing(true);
      setReturnToReview(false);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleEditAnswer = (questionId: string) => {
    const questionIndex = visibleQuestions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentIndex(questionIndex);
      setIsReviewing(false);
      setReturnToReview(true);
    }
  };

  const renderProgressBar = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
          {isReviewing ? 'Validation' : `Provisioning Step ${currentIndex + 1} of ${visibleQuestions.length}`}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/30">
          {isReviewing ? 'Complete' : `${Math.round((currentIndex / visibleQuestions.length) * 100)}%`}
        </span>
      </div>
      <div className="w-full bg-secondary/5 rounded-full h-1 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${isReviewing ? 100 : (currentIndex / visibleQuestions.length) * 100}%` }}
          className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(15,76,92,0.3)]"
        />
      </div>
    </div>
  );

  const renderQuestion = (q: Question) => (
    <div key={q.id} className="space-y-2 animate-fade-in">
      <div className="flex items-center">
        <label htmlFor={q.id} className="block text-lg font-medium text-gray-800">{q.label}</label>
        {q.tip && (
          <div className="relative flex items-center group ml-2">
            <InfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-3 text-xs text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">{q.tip}</div>
          </div>
        )}
      </div>
      {q.type === 'textarea' ? (
        <textarea id={q.id} name={q.id} rows={4} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} onBlur={e => validateField(q, e.target.value)} placeholder={q.placeholder} className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary text-lg ${errors[q.id] ? 'border-red-500' : 'border-gray-300'}`} />
      ) : q.type === 'checkbox' ? (
        <fieldset className="mt-2 space-y-2 border border-gray-200 rounded-md p-4">
          {q.options?.map((option, index) => {
            const isSelectAll = option.id === 'select-all';
            return (
              <React.Fragment key={option.id}>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input id={`${q.id}-${option.id}`} type="checkbox" checked={answers[q.id]?.[option.id] || false} onChange={e => handleCheckboxChange(q.id, option.id, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor={`${q.id}-${option.id}`} className={`font-medium ${isSelectAll ? 'text-primary' : 'text-gray-900'}`}>{option.label}</label>
                  </div>
                </div>
                {isSelectAll && index === 0 && <hr className="my-2 border-gray-200" />}
              </React.Fragment>
            );
          })}
        </fieldset>
      ) : (
        <input id={q.id} name={q.id} type={q.type} readOnly={q.id === 'reviewDate'} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} onBlur={e => validateField(q, e.target.value)} placeholder={q.placeholder} className={`w-full p-3 border rounded-md shadow-sm focus:ring-primary focus:border-primary text-lg ${errors[q.id] ? 'border-red-500' : 'border-gray-300'} ${q.id === 'reviewDate' ? 'bg-gray-100' : ''}`} />
      )}
      {errors[q.id] && <p className="text-red-600 text-xs mt-1">{errors[q.id]}</p>}
    </div>
  );

  return (
    <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-secondary/5 shadow-2xl shadow-secondary/5 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif italic text-secondary">{item.title}</h2>
        <p className="text-secondary/40 text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Configuration</p>
      </div>

      {renderProgressBar()}

      <div className="min-h-[200px]">
        {isReviewing ? (
          <div className="animate-fade-in space-y-4">
            {visibleQuestions.map(q => (
              <div key={q.id} className="p-3 bg-light rounded-md border border-gray-200 flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">{q.label}</p>
                  <p className="font-semibold text-secondary">{answers[q.id] ? String(answers[q.id]) : <i className="text-gray-400">Not answered</i>}</p>
                </div>
                <button onClick={() => handleEditAnswer(q.id)} className="flex items-center text-sm font-semibold text-primary hover:underline">
                  <EditIcon className="w-4 h-4 mr-1" /> Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Company Voice selector removed here as it is now part of the profile */}
            {currentQuestion && renderQuestion(currentQuestion)}
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button onClick={handleBack} disabled={currentIndex === 0 && !isReviewing} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Back</button>
        {isReviewing ? (
          <button onClick={onGenerate} className="px-6 py-3 text-base font-bold text-white bg-green-600 rounded-md hover:bg-green-700">Generate My Document</button>
        ) : (
          <button onClick={handleNext} className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90">Next</button>
        )}
      </div>
    </div>
  );
};

export default GuidedQuestionnaire;
