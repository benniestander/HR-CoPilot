
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
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between"
        >
          <div className="flex items-start sm:items-center mb-3 sm:mb-0">
            <div className={`p-2 rounded-lg mr-4 ${doc.kind === 'policy' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {doc.outputFormat === 'excel' ? <ExcelIcon className="w-6 h-6" /> : <WordIcon className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-secondary text-lg">{doc.title}</h4>
              <p className="text-sm text-gray-500">
                {doc.kind === 'policy' ? 'Policy' : 'Form'} • v{doc.version} • {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => onViewDocument(doc)}
            className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
          >
            View / Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentHistory;
