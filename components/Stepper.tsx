import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepClickable?: boolean;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick, isStepClickable = false }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="relative">
        <div className="absolute left-[10%] right-[10%] top-[22px] h-px bg-secondary/5" aria-hidden="true"></div>
        <div
          className="absolute left-[10%] top-[22px] h-px bg-primary transition-all duration-700 ease-in-out"
          style={{ width: `${Math.max(0, (currentStep - 1) * 40)}%` }}
        ></div>

        <div className="relative flex justify-between">
          {steps.map((label, index) => {
            const stepIndex = index + 1;
            const isCompleted = currentStep > stepIndex;
            const isCurrent = currentStep === stepIndex;
            const canClick = isStepClickable && currentStep > stepIndex;

            return (
              <div
                key={label}
                className={`flex flex-col items-center text-center ${canClick ? 'cursor-pointer group' : ''} relative z-10 transition-all duration-300`}
                onClick={() => canClick && onStepClick(stepIndex)}
              >
                <div
                  className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 transition-all duration-500 transform
                    ${isCompleted ? 'bg-primary border-primary text-white scale-100' : ''}
                    ${isCurrent ? 'bg-white border-primary text-primary shadow-lg shadow-primary/10 scale-110' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white border-secondary/5 text-secondary/20' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 animate-in fade-in zoom-in duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-black tracking-widest uppercase">{`0${stepIndex}`}</span>
                  )}
                </div>
                <div className="mt-4 space-y-0.5">
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors
                      ${isCurrent || isCompleted ? 'text-primary' : 'text-secondary/20'}
                    `}>
                    {`Step ${stepIndex}`}
                  </p>
                  <p className={`text-[11px] font-medium font-serif italic transition-colors
                      ${isCurrent || isCompleted ? 'text-secondary' : 'text-secondary/20'}
                    `}>
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;