
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 id="legal-modal-title" className="text-2xl font-bold text-secondary">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="  0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
           <article className="prose max-w-none prose-h3:font-bold prose-h3:text-secondary prose-p:text-gray-700 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 prose-strong:text-secondary">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
          </article>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end flex-shrink-0">
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

export default LegalModal;
