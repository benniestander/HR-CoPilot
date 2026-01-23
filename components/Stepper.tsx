import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepClickable?: boolean;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick, isStepClickable = false }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300" aria-hidden="true"></div>
        <div className="relative flex justify-between">
          {steps.map((label, index) => {
            const stepIndex = index + 1;
            const isCompleted = currentStep > stepIndex;
            const isCurrent = currentStep === stepIndex;
            const canClick = isStepClickable && currentStep > stepIndex;

            return (
              <div
                key={label}
                className={`flex flex-col items-center text-center ${canClick ? 'cursor-pointer' : ''}`}
                onClick={() => canClick && onStepClick(stepIndex)}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300
                    ${isCompleted ? 'bg-primary border-primary text-white' : ''}
                    ${isCurrent ? 'bg-white border-primary text-primary' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="font-bold">{stepIndex}</span>
                  )}
                </div>
                <p className={`mt-2 text-sm font-semibold 
                  ${isCurrent || isCompleted ? 'text-primary' : 'text-gray-500'}
                `}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;