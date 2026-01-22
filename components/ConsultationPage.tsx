
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';
import { startConsultationStream } from '../services/geminiService';
import { ChatIcon, BriefingIcon, UserIcon, LoadingIcon, ShieldCheckIcon } from './Icons';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Message {
    role: 'user' | 'model';
    content: string;
    groundingMetadata?: any;
}

const ConsultationPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useAuthContext();
    const { isMobile } = useUIContext();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: `Greetings. I am **Ingcweti**, your senior legal intelligence partner. How may I assist your enterprise with South African labour compliance today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        let assistantContent = '';
        const assistantMessage: Message = { role: 'model', content: '' };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const stream = startConsultationStream(input, messages.map(m => ({ role: m.role, content: m.content })), user?.profile);

            for await (const chunk of stream) {
                if (chunk.text) {
                    assistantContent += chunk.text;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            ...newMessages[newMessages.length - 1],
                            content: assistantContent,
                            groundingMetadata: chunk.groundingMetadata || newMessages[newMessages.length - 1].groundingMetadata
                        };
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Consultation Error:", error);
            setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'model', content: "I apologize, but my connection to the legal archives was interrupted. Please re-state your query." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (content: string) => {
        const rawHtml = marked.parse(content) as string;
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        return <div className="prose prose-invert max-w-none text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
    };

    return (
        <div className={`max-w-5xl mx-auto ${isMobile ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-120px)]'} flex flex-col space-y-4 md:space-y-6 animate-fade-in`}>
            <div className={`flex justify-between items-end border-b border-secondary/5 ${isMobile ? 'pb-4 px-2' : 'pb-6'}`}>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">Intelligence Briefing</p>
                    <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-secondary leading-tight`}>Consult with Ingcweti</h1>
                    {!isMobile && <p className="text-secondary/40 text-sm">Strategic South African Labour Law Advisory</p>}
                </div>
                <button onClick={onBack} className="text-secondary/40 hover:text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/5 px-4 py-2 rounded-xl transition-all">
                    {isMobile ? 'Exit' : 'Exit Room'}
                </button>
            </div>

            <div className={`flex-1 bg-secondary ${isMobile ? 'rounded-[2rem]' : 'rounded-[3rem]'} shadow-2xl relative overflow-hidden flex flex-col border border-white/5`}>
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

                {/* Chat Area */}
                <div ref={scrollRef} className={`flex-1 overflow-y-auto ${isMobile ? 'p-6 space-y-8' : 'p-12 space-y-10'} relative z-10 scrollbar-hide`}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-6`}
                        >
                            {m.role === 'model' && (
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-xl">
                                    <BriefingIcon className="w-6 h-6 text-accent" />
                                </div>
                            )}

                            <div className={`${isMobile ? 'max-w-full' : 'max-w-[80%]'} space-y-2`}>
                                <div className={`${isMobile ? 'p-6 rounded-2xl' : 'p-8 rounded-[2rem]'} shadow-2xl ${m.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white/5 backdrop-blur-md border border-white/5 text-white/90 rounded-tl-none'
                                    }`}>
                                    {m.role === 'user' ? (
                                        <p className="text-sm font-bold tracking-tight">{m.content}</p>
                                    ) : (
                                        renderMessageContent(m.content)
                                    )}
                                </div>

                                {m.groundingMetadata?.searchEntryPoint && (
                                    <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-white/5 rounded-full border border-white/5 w-fit">
                                        <ShieldCheckIcon className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Grounded via Google Search</span>
                                    </div>
                                )}
                            </div>

                            {m.role === 'user' && (
                                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                                    <UserIcon className="w-5 h-5 text-primary" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start gap-6 animate-pulse">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <LoadingIcon className="w-5 h-5 text-accent animate-spin" />
                            </div>
                            <div className="bg-white/5 h-12 w-48 rounded-[2rem] border border-white/5"></div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className={`${isMobile ? 'p-4' : 'p-8'} bg-white/5 backdrop-blur-3xl border-t border-white/5 relative z-20`}>
                    <div className="max-w-4xl mx-auto flex gap-3 md:gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isMobile ? "How can I assist?" : "Inquire about retrenchment, disciplinary codes, or POPIA..."}
                            className={`flex-1 bg-white/5 border border-white/10 rounded-2xl ${isMobile ? 'px-5 py-4' : 'px-8 py-5'} text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-white/20`}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className={`${isMobile ? 'px-6 py-4' : 'px-10 py-5'} bg-accent text-secondary font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isMobile ? 'Send' : 'Consult'}
                        </button>
                    </div>
                    <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.4em] mt-6">
                        Confidential Briefing | Logged for Compliance Audit
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConsultationPage;
