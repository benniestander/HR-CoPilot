import React, { Suspense } from "react";
import ConsultantNavbar from "./consultant_landing/ConsultantNavbar";
import Footer from "./landing_new/Footer";
import ConsultantHero from "./consultant_landing/ConsultantHero";
import ConsultantFeatures from "./consultant_landing/ConsultantFeatures";
import ConsultantRevenueSimulator from "./consultant_landing/ConsultantRevenueSimulator";
import ConsultantTestimonials from "./consultant_landing/ConsultantTestimonials";
import ConsultantCTA from "./consultant_landing/ConsultantCTA";

const ConsultantLandingPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            <ConsultantNavbar />

            <Suspense fallback={<div className="h-screen bg-slate-900 animate-pulse" />}>
                <ConsultantHero />
                <ConsultantFeatures />
                <ConsultantRevenueSimulator />
                <ConsultantTestimonials />
                <ConsultantCTA />
            </Suspense>

            <Footer />
        </main>
    );
};

export default ConsultantLandingPage;
