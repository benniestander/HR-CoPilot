import React, { useState } from 'react';
import { MasterPolicyIcon, ComplianceIcon, UpdateIcon } from './Icons';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface OnboardingWalkthroughProps {
  onClose: () => void;
}

const tourSteps = [
  {
    icon: MasterPolicyIcon,
    title: 'Welcome to HR CoPilot!',
    content: "Let's take a quick tour to show you how to get the most out of your HR CoPilot.",
  },
  {
    icon: MasterPolicyIcon,
    title: 'Generate Policies & Forms',
    content: 'Start by selecting a document from the lists below. The AI will guide you through a few questions to create a customized, compliant document in minutes.',
  },
  {
    icon: ComplianceIcon,
    title: 'Get a Compliance Checklist',
    content: "Not sure where to begin? Use the Compliance Checklist tool. It analyzes your company profile and provides a personalized action plan of essential HR documents.",
  },
  {
    icon: UpdateIcon,
    title: 'Keep Your Documents Current',
    content: "Labour laws change. Use the Policy Updater to scan your existing documents for compliance, ensuring your business stays protected.",
  },
];

const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const modalRef = useFocusTrap<HTMLDivElement>(true, onClose);
  const currentStep = tourSteps[step];

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkthrough-title"
      >
        <div className="p-6 text-center border-b border-gray-200">
          <currentStep.icon className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 id="walkthrough-title" className="text-2xl font-bold text-secondary">{currentStep.title}</h2>
        </div>
        <div className="p-6 text-center">
            <p className="text-gray-600">{currentStep.content}</p>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                    index === step ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="text-sm font-semibold text-gray-600 hover:text-primary"
                >
                    Skip Tour
                </button>
                <div className="flex space-x-2">
                     {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90"
                    >
                        {step === tourSteps.length - 1 ? "Let's Go!" : 'Next'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;