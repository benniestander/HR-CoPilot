
import React from 'react';
import type { GeneratedDocument } from '../types';
import { WordIcon, ExcelIcon, MasterPolicyIcon, FormsIcon } from './Icons';
import EmptyState from './EmptyState';

interface DocumentHistoryProps {
  documents: GeneratedDocument[];
  onViewDocument: (doc: GeneratedDocument) => void;
  onNavigateToGenerator: () => void;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ documents, onViewDocument, onNavigateToGenerator }) => {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents yet"
        description="Your generated policies and forms will appear here."
        icon={MasterPolicyIcon}
        actionLabel="Create your first document"
        onAction={onNavigateToGenerator}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none" />

          <div className="flex items-start sm:items-center mb-4 sm:mb-0 relative z-10">
            <div className={`p-4 rounded-2xl mr-5 shadow-sm transition-transform group-hover:scale-110 ${doc.kind === 'policy'
              ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
              {doc.outputFormat === 'excel' ? <ExcelIcon className="w-6 h-6" /> : <WordIcon className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-black text-secondary text-lg mb-1 group-hover:text-primary transition-colors">{doc.title}</h4>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span className={`px-2 py-0.5 rounded-full ${doc.kind === 'policy' ? 'bg-blue-100/50 text-blue-700' : 'bg-emerald-100/50 text-emerald-700'
                  }`}>
                  {doc.kind === 'policy' ? 'Policy' : 'Form'}
                </span>
                <span>v{doc.version}</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onViewDocument(doc)}
            className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-secondary bg-white border border-gray-100 rounded-xl hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1 relative z-10"
          >
            Access
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentHistory;
