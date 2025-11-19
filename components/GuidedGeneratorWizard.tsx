import React, { useState } from 'react';
import type { Policy, Form, CompanyProfile, FormAnswers } from '../types';
import BulkQuestionnaire from './BulkQuestionnaire';

interface GuidedGeneratorWizardProps {
  items: (Policy | Form)[];
  userProfile: CompanyProfile;
  onComplete: (answers: Record<string, FormAnswers>) => void;
  onCancel: () => void;
}

const GuidedGeneratorWizard: React.FC<GuidedGeneratorWizardProps> = ({ items, userProfile, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<Record<string, FormAnswers>>({});

  const currentItem = items[currentIndex];
  const progressPercentage = ((currentIndex + 1) / items.length) * 100;

  const handleAnswersChange = (newAnswers: FormAnswers) => {
    setAllAnswers(prev => ({
      ...prev,
      [currentItem.type]: newAnswers,
    }));
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Here you would trigger the bulk generation
    onComplete(allAnswers);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
       <button onClick={onCancel} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Cancel and Go to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-secondary text-center">Guided Document Generation</h2>
        <p className="text-gray-600 mt-2 mb-8 text-center">Let's customize your documents one by one.</p>
        
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-primary">Step {currentIndex + 1} of {items.length}</span>
                <span className="text-sm font-medium text-primary">{currentItem.title}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>

        <BulkQuestionnaire
          item={currentItem}
          companyProfile={userProfile}
          answers={allAnswers[currentItem.type] || {}}
          onAnswersChange={handleAnswersChange}
          onGenerate={() => {}} // This is handled by wizard buttons
          status="idle"
        />

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <button
                onClick={handleBack}
                disabled={currentIndex === 0}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Back
            </button>

            {currentIndex < items.length - 1 ? (
                 <button
                    onClick={handleNext}
                    className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90"
                >
                    Next: {items[currentIndex + 1].title}
                </button>
            ) : (
                <button
                    onClick={handleFinish}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    Finish & Generate All Documents
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default GuidedGeneratorWizard;