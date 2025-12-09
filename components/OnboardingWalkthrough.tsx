
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface OnboardingWalkthroughProps {
  onClose: () => void;
}

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-welcome',
    title: 'Welcome to HR CoPilot',
    content: 'This is your Dashboard. From here you can access all tools, view your credit balance, and see your compliance status at a glance.',
    position: 'bottom'
  },
  {
    targetId: 'tour-compliance',
    title: 'Your Compliance Score',
    content: 'We analyze your generated documents against your industry profile to give you a real-time compliance score. It updates automatically as you create more documents.',
    position: 'bottom'
  },
  {
    targetId: 'tour-roadmap',
    title: 'Compliance Roadmap',
    content: "Not sure what you need? Click here to see a prioritized checklist of mandatory and recommended documents specific to your business size and sector.",
    position: 'top'
  },
  {
    targetId: 'tour-updater',
    title: 'Policy Updater',
    content: 'Have existing policies from elsewhere? Upload them here. Our AI will scan them against current labour laws and suggest improvements.',
    position: 'top'
  },
  {
    targetId: 'tour-generator',
    title: 'Document Generator',
    content: 'Use these tabs to switch between generating Policies (like Disciplinary Codes) and Forms (like Contracts). Just click an item to start the wizard.',
    position: 'top'
  }
];

const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({ onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Hook to handle window resize recalculations
  useEffect(() => {
    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [currentStepIndex]);

  const updateTargetPosition = useCallback(() => {
    const step = TOUR_STEPS[currentStepIndex];
    const element = document.getElementById(step.targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Small delay to allow scroll to finish before calculating rect
      setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
      }, 400);
    } else {
      // If target not found (e.g. mobile view hiding elements), skip or close
      if (currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
      } else {
          onClose();
      }
    }
  }, [currentStepIndex, onClose]);

  useEffect(() => {
    updateTargetPosition();
  }, [updateTargetPosition]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!targetRect) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  // Calculate tooltip position logic
  // Default to bottom if not specified or if logic gets complex
  let tooltipStyle: React.CSSProperties = {
      position: 'absolute',
      width: '320px',
      zIndex: 60,
  };

  const isMobile = window.innerWidth < 768;
  const margin = 12;

  if (isMobile) {
      // Simplified mobile positioning: always centered bottom or top based on target Y
      tooltipStyle.left = '50%';
      tooltipStyle.transform = 'translateX(-50%)';
      if (targetRect.bottom > window.innerHeight / 2) {
          tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
      } else {
          tooltipStyle.top = targetRect.bottom + margin;
      }
  } else {
      // Desktop positioning
      tooltipStyle.left = targetRect.left;
      
      if (currentStep.position === 'top') {
          tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
      } else {
          tooltipStyle.top = targetRect.bottom + margin;
      }

      // Edge detection fix
      if (targetRect.left + 320 > window.innerWidth) {
          tooltipStyle.left = 'auto';
          tooltipStyle.right = window.innerWidth - targetRect.right;
      }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 
        The Spotlight Effect using Box Shadow. 
        This is a classic CSS trick: a huge box-shadow creates the dim overlay, 
        leaving the content inside the div "cut out".
      */}
      <div 
        className="absolute transition-all duration-500 ease-in-out pointer-events-none rounded-lg"
        style={{
          top: targetRect.top - 4, // Slight padding
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
        }}
      />

      {/* Tooltip Card */}
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl p-6 transition-all duration-300 animate-fade-in border border-gray-100"
        style={tooltipStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <h3 id="tour-title" className="text-lg font-bold text-secondary mb-2">
            {currentStep.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {currentStep.content}
        </p>

        <div className="flex justify-between items-center">
            {currentStepIndex > 0 ? (
                <button 
                    onClick={handleBack}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                    Back
                </button>
            ) : (
                <button onClick={onClose} className="text-sm font-semibold text-gray-400 hover:text-gray-600">Skip Tour</button>
            )}

            <button
                onClick={handleNext}
                className="bg-primary text-white text-sm font-bold py-2 px-6 rounded-md hover:bg-opacity-90 shadow-sm transition-transform active:scale-95"
            >
                {isLastStep ? 'Finish' : 'Next'}
            </button>
        </div>
        
        {/* Little arrow pointing to target */}
        {!isMobile && (
            <div 
                className="absolute w-4 h-4 bg-white transform rotate-45"
                style={{
                    ...(currentStep.position === 'top' 
                        ? { bottom: -6, left: 20 } 
                        : { top: -6, left: 20 }
                    ),
                    ...(targetRect.left + 320 > window.innerWidth ? { left: 'auto', right: 20 } : {})
                }}
            />
        )}
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;
