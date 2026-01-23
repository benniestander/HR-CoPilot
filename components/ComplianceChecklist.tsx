import React, { useState, useMemo } from 'react';
import { getComplianceRoadmap, RoadmapItem } from '../utils/compliance';
import type { Policy, Form, CompanyProfile } from '../types';
import { ComplianceIcon, MasterPolicyIcon, FormsIcon, CheckIcon, ShieldCheckIcon, InfoIcon, BellIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { PolicyType, FormType } from '../types';

interface ComplianceChecklistProps {
    userProfile: CompanyProfile;
    onBack: () => void;
    onSelectDocument: (item: Policy | Form) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ userProfile, onBack, onSelectDocument }) => {
    const { generatedDocuments } = useDataContext();
    const { setSelectedItem, setDocumentToView, navigateTo } = useUIContext();
    const [filter, setFilter] = useState<'all' | 'missing'>('all');

    const roadmap = useMemo(() => {
        return getComplianceRoadmap(userProfile, generatedDocuments);
    }, [userProfile, generatedDocuments]);

    const phase1Items = roadmap.filter(i => i.phase === 1 && (filter === 'all' || i.status === 'missing'));
    const phase2Items = roadmap.filter(i => i.phase === 2 && (filter === 'all' || i.status === 'missing'));
    const phase3Items = roadmap.filter(i => i.phase === 3 && (filter === 'all' || i.status === 'missing'));

    const completedCount = roadmap.filter(i => i.status === 'completed').length;

    const onSelectItem = (type: PolicyType | FormType, isPolicy: boolean) => {
        const item = isPolicy ? POLICIES[type as PolicyType] : FORMS[type as FormType];
        if (item) {
            onSelectDocument(item);
        }
    };

    const onViewDocument = (type: PolicyType | FormType) => {
        const doc = generatedDocuments.find(d => d.type === type);
        if (doc) {
            setDocumentToView(doc);
            const item = doc.kind === 'policy' ? POLICIES[doc.type as PolicyType] : FORMS[doc.type as FormType];
            setSelectedItem(item);
            navigateTo('generator');
        }
    };

    const renderRoadmapItem = (item: RoadmapItem) => {
        const isPolicy = item.type === 'policy';
        const isCompleted = item.status === 'completed';

        return (
            <div key={item.id} className={`flex flex-col sm:flex-row items-start justify-between p-4 border rounded-lg shadow-sm transition-colors ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary/50'}`}>
                <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center mb-1">
                        {isPolicy ? <MasterPolicyIcon className="w-4 h-4 text-gray-400 mr-2" /> : <FormsIcon className="w-4 h-4 text-gray-400 mr-2" />}
                        <h4 className={`font-bold text-lg ${isCompleted ? 'text-green-800' : 'text-secondary'}`}>{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                </div>

                <div className="flex-shrink-0 sm:ml-4 self-start sm:self-center">
                    {isCompleted ? (
                        <button
                            onClick={() => onViewDocument(item.id)}
                            className="flex items-center px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 rounded-md hover:bg-green-200 transition-colors"
                        >
                            <CheckIcon className="w-4 h-4 mr-1.5" />
                            Done
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelectItem(item.id, isPolicy)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-opacity-90 shadow-sm whitespace-nowrap"
                        >
                            Generate Now
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Dashboard
            </button>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                        <ComplianceIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-secondary">Optimized Audit Checklist</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Based on your profile (<strong>{userProfile.companyName}</strong> - {userProfile.industry}), here is your prioritized roadmap to full compliance.
                    </p>
                </div>

                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            All Requirements
                        </button>
                        <button
                            onClick={() => setFilter('missing')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'missing' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Show Missing Only
                        </button>
                    </div>
                    <div className="text-sm text-gray-500 hidden sm:block">
                        <span className="font-bold text-green-600">{completedCount}</span> of <span className="font-bold text-secondary">{roadmap.length}</span> completed
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Phase 1 */}
                    {phase1Items.length > 0 && (
                        <div>
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold mr-3">1</span>
                                    <h3 className="text-xl font-bold text-red-700">Statutory Requirements (Inspector Ready)</h3>
                                </div>
                                <p className="text-sm text-gray-500 ml-11 mt-1">
                                    <span className="font-bold text-red-600">Immediate Fines Risk:</span> Failure to produce these documents during an inspection can result in immediate compliance orders or fines.
                                </p>
                            </div>
                            <div className="space-y-3 ml-0 sm:ml-11">
                                {phase1Items.map(renderRoadmapItem)}
                            </div>
                        </div>
                    )}

                    {/* Phase 2 */}
                    {phase2Items.length > 0 && (
                        <div>
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-3">2</span>
                                    <h3 className="text-xl font-bold text-orange-700">Critical Risk Mitigators (CCMA Defence)</h3>
                                </div>
                                <p className="text-sm text-gray-500 ml-11 mt-1">
                                    <span className="font-bold text-orange-600">Liability Risk:</span> These documents are your legal shield against unfair dismissal claims and financial liability at the CCMA.
                                </p>
                            </div>
                            <div className="space-y-3 ml-0 sm:ml-11">
                                {phase2Items.map(renderRoadmapItem)}
                            </div>
                        </div>
                    )}

                    {/* Phase 3 */}
                    {phase3Items.length > 0 && (
                        <div>
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">3</span>
                                    <h3 className="text-xl font-bold text-blue-700">Good Governance (Clarity & Culture)</h3>
                                </div>
                                <p className="text-sm text-gray-500 ml-11 mt-1">
                                    <span className="font-bold text-blue-600">Operational Efficiency:</span> Best practices that reduce friction, clarify rules, and improve company culture.
                                </p>
                            </div>
                            <div className="space-y-3 ml-0 sm:ml-11">
                                {phase3Items.map(renderRoadmapItem)}
                            </div>
                        </div>
                    )}

                    {phase1Items.length === 0 && phase2Items.length === 0 && phase3Items.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <CheckIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">All Clear!</h3>
                            <p className="text-gray-600">You have completed all items in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceChecklist;