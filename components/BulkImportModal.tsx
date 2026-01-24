import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthContext } from '../contexts/AuthContext';
import { bulkImportClients } from '../services/dbService';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, refetchProfile } = useAuthContext();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const clients = lines.slice(1).map((line, idx) => {
                    const values = line.split(',').map(v => v.trim());
                    // Basic mapping logic
                    return {
                        id: `import-${Date.now()}-${idx}`,
                        name: values[getIdx(headers, 'name')] || values[0],
                        email: values[getIdx(headers, 'email')] || values[1],
                        companyName: values[getIdx(headers, 'company')] || values[2],
                        industry: values[getIdx(headers, 'industry')] || 'General',
                        paidUntil: new Date(Date.now() + 31536000000).toISOString() // Default 1 year access if Agency
                    };
                });
                setPreview(clients.slice(0, 5)); // Preview first 5
                setError(null);
            } catch (err) {
                setError("Failed to parse CSV. Please ensure format: Name, Email, Company, Industry");
            }
        };
        reader.readAsText(file);
    };

    const getIdx = (headers: string[], key: string) => {
        return headers.findIndex(h => h.includes(key));
    };

    const handleImport = async () => {
        if (!user || !file) return;
        setIsUploading(true);
        try {
            await bulkImportClients(user.uid, preview);
            await refetchProfile();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Import failed.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Bulk Client Import</h2>
                            <p className="text-slate-500 font-medium mt-2">Upload a CSV to onboard multiple clients instantly.</p>
                        </div>

                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-10 text-center cursor-pointer transition-all group"
                            >
                                <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-primary mx-auto mb-4 transition-colors" />
                                <span className="block text-sm font-bold text-slate-600">Click to upload CSV</span>
                                <span className="block text-xs text-slate-400 mt-1">Format: Name, Email, Company, Industry</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <FileText className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setFile(null); setPreview([]); }} className="text-xs font-bold text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </div>

                                {preview.length > 0 && (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preview ({preview.length} records)</p>
                                        <div className="space-y-2">
                                            {preview.slice(0, 3).map((c, i) => (
                                                <div key={i} className="flex items-center space-x-2 text-sm text-slate-600">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    <span>{c.companyName} ({c.name})</span>
                                                </div>
                                            ))}
                                            {preview.length > 3 && (
                                                <p className="text-xs text-slate-400 italic pl-6">...and {preview.length - 3} more</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <div className="mt-8">
                            <Button
                                onClick={handleImport}
                                disabled={!file || isUploading}
                                className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                            >
                                {isUploading ? "Importing Clients..." : "Run Import"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BulkImportModal;
