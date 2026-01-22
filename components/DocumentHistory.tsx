
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
    <div className="grid grid-cols-1 gap-6">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-secondary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex items-start sm:items-center mb-4 sm:mb-0 relative z-10">
            <div className={`p-5 rounded-2xl mr-6 shadow-inner border border-white/40 transition-all duration-500 group-hover:scale-105 ${doc.kind === 'policy'
              ? 'bg-secondary/5 text-primary group-hover:bg-primary group-hover:text-white'
              : 'bg-accent/5 text-accent group-hover:bg-accent group-hover:text-secondary'
              }`}>
              {doc.outputFormat === 'excel' ? <ExcelIcon className="w-6 h-6" /> : <WordIcon className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-medium text-secondary text-xl mb-1 group-hover:text-primary transition-colors font-serif italic tracking-tight">{doc.title}</h4>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-secondary/30">
                <span className={`px-2.5 py-1 rounded-lg border ${doc.kind === 'policy' ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-accent/5 border-accent/10 text-accent'
                  }`}>
                  {doc.kind === 'policy' ? 'Policy' : 'Form'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-secondary/10"></span>
                  Revision {doc.version}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-secondary/10"></span>
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onViewDocument(doc)}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary bg-white border border-secondary/5 rounded-xl hover:bg-secondary hover:text-white hover:border-secondary shadow-sm hover:shadow-xl transition-all active:scale-95 relative z-10"
          >
            Open Vault
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentHistory;
