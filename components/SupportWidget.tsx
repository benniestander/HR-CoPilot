
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XIcon,
    MinusIcon,
    PaperclipIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon
} from './Icons';
import { useAuthContext } from '../contexts/AuthContext';
import { emailService } from '../services/emailService';

const SupportWidget: React.FC = () => {
    const { user } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.message || !form.email) return;

        setIsSubmitting(true);

        try {
            // 1. Send Ticket to Admin
            await emailService.sendSupportTicketToAdmin(
                form.name || 'Anonymous User',
                form.email,
                form.message,
                files.length
            );

            // 2. Send Auto-Reply to User
            await emailService.sendSupportAutoReply(
                form.email,
                form.name || 'Valued User'
            );

            setIsSuccess(true);

            // Success reset
            setTimeout(() => {
                setIsSuccess(false);
                setForm(prev => ({ ...prev, message: '' }));
                setFiles([]);
                setIsOpen(false);
            }, 3000);
        } catch (error) {
            console.error("Support submission failed:", error);
            alert("Sorry, we couldn't send your message at this time. Please try again or email admin@hrcopilot.co.za directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#7c7cf8] p-5 flex justify-between items-center text-white flex-shrink-0">
                            <span className="font-bold tracking-tight">Leave us a message</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <MinusIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Your name (optional)</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                placeholder="Enter your name"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c7cf8]/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Email address</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="name@company.com"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c7cf8]/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">How can we help you?</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                placeholder="Tell us what's on your mind..."
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c7cf8]/20 transition-all resize-none"
                                            />
                                        </div>

                                        {/* Attachments Area */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Attachments</label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#7c7cf8]/50 hover:bg-gray-50 transition-all"
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    multiple
                                                    onChange={handleFileChange}
                                                />
                                                <div className="flex items-center text-gray-400 text-sm font-medium">
                                                    <PaperclipIcon className="w-4 h-4 mr-2 text-[#7c7cf8]" />
                                                    {files.length === 0 ? 'Add up to 5 files' : `${files.length} files added`}
                                                </div>
                                            </div>

                                            {/* File Tags */}
                                            {files.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {files.map((file, i) => (
                                                        <div key={i} className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-[10px] text-gray-600 font-bold border border-gray-200 group">
                                                            <span className="truncate max-w-[80px]">{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                                className="ml-1 text-gray-400 hover:text-red-500"
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer / Send */}
                                        <div className="pt-4 flex justify-between items-center bg-white">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">HR CoPilot Support</span>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !form.message}
                                                className="bg-[#7c7cf8] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#7c7cf8]/20 hover:shadow-[#7c7cf8]/40 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50 disabled:scale-100 flex items-center"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        Send
                                                        <PaperAirplaneIcon className="w-4 h-4 ml-2" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="py-12 flex flex-col items-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 border border-green-100">
                                            <CheckCircleIcon className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h4 className="text-xl font-black text-secondary mb-2 leading-tight">Message Received!</h4>
                                        <p className="text-sm text-gray-500 font-medium px-4">
                                            We've received your inquiry and will get back to you shortly (usually within 24 hours).
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Support Bubble */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-secondary text-white' : 'bg-[#7c7cf8] text-white rotate-0'}`}
            >
                {isOpen ? (
                    <XIcon className="w-7 h-7" />
                ) : (
                    <ChatBubbleLeftRightIcon className="w-7 h-7" />
                )}

                {/* Notification Dot */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-400 border-2 border-white rounded-full animate-bounce"></span>
                )}
            </motion.button>
        </div>
    );
};

export default SupportWidget;
