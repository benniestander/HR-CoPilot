
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
    title: 'Welcome to Your Compliance HQ',
    content: 'This Dashboard is your command center. From here, you can manage your staff documents, track your legal risks, and access your credit balance.',
    position: 'bottom'
  },
  {
    targetId: 'tour-compliance',
    title: 'Know Your Risk Score',
    content: 'Don\'t guess about compliance. We analyze your company profile against South African labour law to give you a real-time score. Watch this turn green as you generate documents!',
    position: 'bottom'
  },
  {
    targetId: 'tour-roadmap',
    title: 'Your Legal Roadmap',
    content: "Not sure what documents you need? This Roadmap is your personalized checklist. It prioritizes documents based on YOUR industry and size to keep you out of the CCMA.",
    position: 'top'
  },
  {
    targetId: 'tour-updater',
    title: 'Update Existing Policies',
    content: 'Have old contracts or policies? Don\'t throw them away. Upload them here, and our Ingcweti AI will scan them for gaps against the latest legislation.',
    position: 'top'
  },
  {
    targetId: 'tour-generator',
    title: 'Generate Documents Instantly',
    content: 'Ready to create? Switch between Policies (like Disciplinary Codes) and Forms (like Contracts). Click any item, answer a few questions, and get a legally-sound document in minutes.',
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
  let tooltipStyle: React.CSSProperties = {
      position: 'absolute',
      width: '340px',
      zIndex: 60,
  };

  const isMobile = window.innerWidth < 768;
  const margin = 16;
  const tooltipHeightEstimate = 320; // Conservative estimate

  if (isMobile) {
      tooltipStyle.left = '50%';
      tooltipStyle.transform = 'translateX(-50%)';
      if (targetRect.bottom > window.innerHeight / 2) {
          tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
      } else {
          tooltipStyle.top = targetRect.bottom + margin;
      }
  } else {
      tooltipStyle.left = targetRect.left;
      
      let pos = currentStep.position;
      
      // Smart flip logic for desktop
      const spaceAbove = targetRect.top;
      const spaceBelow = window.innerHeight - targetRect.bottom;

      if (pos === 'top' && spaceAbove < tooltipHeightEstimate && spaceBelow > spaceAbove) {
          pos = 'bottom';
      } else if (pos === 'bottom' && spaceBelow < tooltipHeightEstimate && spaceAbove > spaceBelow) {
          pos = 'top';
      }

      if (pos === 'top') {
          tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
      } else {
          tooltipStyle.top = targetRect.bottom + margin;
      }

      // Prevent going off right screen edge
      if (targetRect.left + 340 > window.innerWidth) {
          tooltipStyle.left = 'auto';
          tooltipStyle.right = window.innerWidth - targetRect.right;
          if (tooltipStyle.right && (tooltipStyle.right as number) < 0) tooltipStyle.right = 10;
      }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Spotlight Effect */}
      <div 
        className="absolute transition-all duration-500 ease-in-out pointer-events-none rounded-lg ring-4 ring-primary/50 animate-pulse"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
        }}
      />

      {/* Tooltip Card */}
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl p-6 transition-all duration-300 animate-fade-in border-t-4 border-primary overflow-y-auto max-h-[85vh]"
        style={tooltipStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <h3 id="tour-title" className="text-xl font-bold text-secondary mb-3">
            {currentStep.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {currentStep.content}
        </p>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            {currentStepIndex > 0 ? (
                <button 
                    onClick={handleBack}
                    className="text-sm font-semibold text-gray-500 hover:text-secondary transition-colors"
                >
                    Back
                </button>
            ) : (
                <button onClick={onClose} className="text-sm font-semibold text-gray-400 hover:text-gray-600">Skip Tour</button>
            )}

            <button
                onClick={handleNext}
                className="bg-primary text-white text-sm font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 shadow-md transform hover:-translate-y-0.5 transition-all"
            >
                {isLastStep ? 'Complete' : 'Next Step'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;
