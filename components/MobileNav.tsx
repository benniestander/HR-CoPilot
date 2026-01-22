
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ComplianceIcon,
    MasterPolicyIcon,
    UpdateIcon,
    BriefingIcon,
    UserIcon,
    BookIcon
} from './Icons';
import { useUIContext } from '../contexts/UIContext';

const MobileNav: React.FC<{ activeView: string }> = ({ activeView }) => {
    const { navigateTo } = useUIContext();

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: ComplianceIcon },
        { id: 'generator', label: 'Build', icon: MasterPolicyIcon },
        { id: 'consultation', label: 'AI Partner', icon: BriefingIcon },
        { id: 'profile', label: 'Vault', icon: UserIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-2xl border-t border-white/5 px-6 pb-8 pt-4 z-[100] md:hidden">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigateTo(item.id as any)}
                            className="flex flex-col items-center gap-1.5 relative group"
                        >
                            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                    : 'text-white/40 group-active:scale-90'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-accent opacity-100' : 'text-white/20 opacity-0'
                                }`}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="mobile-active-dot"
                                    className="absolute -top-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_#C19958]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
