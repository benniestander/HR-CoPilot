
import React from 'react';
import { motion } from 'framer-motion';
import {
    MasterPolicyIcon,
    ComplianceIcon,
    UpdateIcon,
    UserIcon,
    BookIcon,
    ShieldCheckIcon,
    BriefingIcon
} from './Icons';
import { useUIContext } from '../contexts/UIContext';
import { useAuthContext } from '../contexts/AuthContext';

interface SidebarProps {
    activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
    const { navigateTo } = useUIContext();
    const { user, handleLogout } = useAuthContext();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: ComplianceIcon },
        { id: 'generator', label: 'Generator', icon: MasterPolicyIcon },
        { id: 'updater', label: 'Policy Auditor', icon: UpdateIcon },
        { id: 'consultation', label: 'Intelligence Briefing', icon: BriefingIcon },
        { id: 'checklist', label: 'Compliance Roadmap', icon: ShieldCheckIcon },
        { id: 'knowledge-base', label: 'Archives', icon: BookIcon },
        { id: 'profile', label: 'Business Profile', icon: UserIcon },
    ];

    return (
        <aside className="w-72 bg-secondary h-screen sticky top-0 flex flex-col border-r border-white/5 z-50 overflow-hidden">
            {/* Logo Section */}
            <div className="p-8 mb-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigateTo('dashboard')}
                >
                    <img
                        src="https://i.postimg.cc/h48FMCNY/edited-image-11-removebg-preview.png"
                        alt="HR CoPilot"
                        className="h-8 brightness-0 invert"
                    />
                    <div className="flex flex-col">
                        <span className="text-white font-serif italic text-lg leading-none">CoPilot</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent/60 mt-1">Registry v2.0</span>
                    </div>
                </motion.div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigateTo(item.id as any)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                                />
                            )}
                            <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-6">
                <div className="bg-white/5 rounded-3xl p-5 border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-white/90 truncate font-serif italic italic">{user?.name || user?.email}</p>
                            <p className="text-[8px] font-black text-accent uppercase tracking-widest">{user?.plan === 'pro' ? 'Pro Member' : 'PAYG'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 border border-white/5 hover:border-red-400/20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                    >
                        Terminate Session
                    </button>
                </div>
                <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.5em] mt-6">
                    © 2026 HR CoPilot Enterprise
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
