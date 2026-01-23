import logo from "@/assets/hr-copilot-logo.png";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/90 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="HR CoPilot" className="h-12 w-auto mb-6 brightness-0 invert" />
            <p className="text-background/70 leading-relaxed mb-6">
              Empowering South African SMEs with AI-powered HR solutions that keep you compliant and confident.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Features", "How It Works", "Pricing", "FAQ", "For Consultants"].map((link) => (
                <li key={link}>
                  <a href={link === "For Consultants" ? "#consultants" : `#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-background/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-6">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "POPIA Compliance", "Cookie Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-background/70 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <Mail size={18} className="text-primary" />
                hello@hrcopilot.co.za
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone size={18} className="text-primary" />
                +27 11 123 4567
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin size={18} className="text-primary shrink-0 mt-1" />
                123 Main Street, Sandton, Johannesburg, South Africa
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2024 HR CoPilot. All rights reserved.
            </p>
            <p className="text-background/60 text-sm">
              Built with ❤️ for South African businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
