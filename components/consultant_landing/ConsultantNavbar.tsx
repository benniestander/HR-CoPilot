import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";
import logo from "@/assets/hr-copilot-logo.png";
import { useAuthContext } from "@/contexts/AuthContext";

const navLinks = [
    { name: "Infrastructure", href: "#features" },
    { name: "Economics", href: "#economics" },
    { name: "The Portal", href: "#portal" },
    { name: "For Businesses", href: "#/" },
];

const ConsultantNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setAuthPage } = useAuthContext();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 py-3 shadow-2xl"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center space-x-3 group">
                    <img src={logo} alt="HR CoPilot" className="h-10 md:h-12 w-auto brightness-0 invert" />
                    <div className="hidden lg:block h-6 w-px bg-slate-700" />
                    <div className="hidden lg:flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional</span>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-all duration-300 relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={() => setAuthPage('login')}
                        className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Entry
                    </button>
                    <Button
                        variant="hero"
                        size="lg"
                        className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest"
                        onClick={() => setAuthPage('signup')}
                    >
                        Apply for Access
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl mt-2 mx-4 rounded-[2rem] p-8 border border-slate-800 animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-300 hover:text-primary font-bold text-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="h-px bg-slate-800 my-2" />
                        <Button
                            variant="hero"
                            size="xl"
                            className="w-full h-16 rounded-2xl font-black text-lg"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setAuthPage('signup');
                            }}
                        >
                            Apply for Access
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ConsultantNavbar;
