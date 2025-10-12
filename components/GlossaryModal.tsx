import React from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: string;
  definition: string;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose, term, definition }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-term"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="glossary-term" className="text-xl font-bold text-secondary capitalize">{term}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="  0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-700">{definition}</p>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;
