import Navbar from "@/components/landing_new/Navbar";
import HeroSection from "@/components/landing_new/HeroSection";
import FeaturesSectionV2 from "@/components/landing_new/FeaturesSectionV2";
import HowItWorksSection from "@/components/landing_new/HowItWorksSection";
import TestimonialsSection from "@/components/landing_new/TestimonialsSection";
import PricingSection from "@/components/landing_new/PricingSection";
import FAQSection from "@/components/landing_new/FAQSection";
import CTASection from "@/components/landing_new/CTASection";
import { useSEO } from "@/hooks/useSEO";
import Footer from "@/components/landing_new/Footer";

const LandingPageV2 = () => {
    useSEO({
        title: "HR CoPilot | South African BCEA-Compliant HR Document Generator",
        description: "The most trusted HR document generator for South African businesses. Legally-vetted BCEA, LRA & POPIA compliant policies and contracts.",
        canonical: "https://hrcopilot.co.za"
    });

    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <FeaturesSectionV2 />
            <HowItWorksSection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </main>
    );
};

export default LandingPageV2;
