import React from 'react';
import ReactMarkdown from 'https://esm.sh/react-markdown@9?deps=react@^19.2.0';
import rehypeSanitize from 'https://esm.sh/rehype-sanitize@6?deps=react@^19.2.0';
import { LoadingIcon } from './Icons';
import type { AppStatus } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ExplainPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanationText: string;
  status: AppStatus;
  itemType: 'policy' | 'form';
}

const ExplainPolicyModal: React.FC<ExplainPolicyModalProps> = ({ isOpen, onClose, explanationText, status, itemType }) => {
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center text-gray-500 py-10">
            <LoadingIcon className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold">Ingcweti is analyzing the document...</h3>
            <p>Crafting a simple explanation for you.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
            <p>We couldn't generate the explanation. Please try again later.</p>
          </div>
        );
      case 'success':
        return (
          <article className="prose prose-lg max-w-none prose-h1:text-2xl prose-h1:font-bold prose-h1:text-secondary prose-h2:text-xl prose-h2:font-semibold prose-h2:text-secondary prose-h3:text-lg prose-h3:font-semibold prose-h3:text-secondary prose-p:text-gray-700 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 prose-strong:text-secondary">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{explanationText}</ReactMarkdown>
          </article>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-modal-title"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="explanation-modal-title" className="text-xl font-bold text-secondary capitalize">{itemType} Explanation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="  0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {renderContent()}
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

export default ExplainPolicyModal;