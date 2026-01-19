
import React from 'react';
import { ExcelIcon, WordIcon, LoadingIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';
import { useUIContext } from '../contexts/UIContext';
import { GeneratedDocument, PolicyType, FormType } from '../types';

interface DocumentHistorySectionProps {
    title: string;
    documents: GeneratedDocument[];
    icon: React.FC<{ className?: string }>;
    isLoading: boolean;
    type: 'policy' | 'form';
}

const DocumentHistorySection: React.FC<DocumentHistorySectionProps> = ({ title, documents, icon: Icon, isLoading, type }) => {
    const { setDocumentToView, setSelectedItem, navigateTo } = useUIContext();

    return (
        <div className="mb-6">
            <div className="flex items-center mb-4">
                <Icon className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-bold text-secondary">{title}</h3>
            </div>
            {isLoading ? (
                <div className="py-8 flex justify-center"><LoadingIcon className="w-8 h-8 animate-spin text-primary" /></div>
            ) : documents.length > 0 ? (
                <ul className="space-y-3">
                    {documents.map(doc => (
                        <li key={doc.id} className="p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all flex justify-between items-center group">
                            <div className="flex items-center">
                                {doc.outputFormat === 'excel' ? <ExcelIcon className="w-8 h-8 text-green-700 mr-3" /> : <WordIcon className="w-8 h-8 text-blue-700 mr-3" />}
                                <div>
                                    <p className="font-bold text-secondary text-sm">{doc.title}</p>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase">v{doc.version} &bull; {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => { setDocumentToView(doc); setSelectedItem(doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType]); navigateTo('generator'); }} className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/5 rounded-lg hover:bg-primary hover:text-white transition-all">View</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No {title.toLowerCase()} yet</p>
                </div>
            )}
        </div>
    );
};

export default DocumentHistorySection;
