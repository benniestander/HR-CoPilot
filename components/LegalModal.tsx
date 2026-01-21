
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
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        ref={modalRef}
        className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-4xl flex flex-col border border-white/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">Legal Document</span>
            <h2 id="legal-modal-title" className="text-2xl font-black text-secondary tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-secondary hover:shadow-lg transition-all"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
          <article className="prose prose-slate max-w-none 
             prose-headings:text-secondary prose-headings:font-black prose-headings:tracking-tight
             prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium
             prose-strong:text-secondary prose-strong:font-black
             prose-ul:list-disc prose-ul:pl-5
             prose-li:text-gray-600 prose-hr:border-gray-100">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
          </article>
        </div>

        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last Updated: 24 Oct 2025
          </p>
          <button
            onClick={onClose}
            className="bg-secondary hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalModal;
