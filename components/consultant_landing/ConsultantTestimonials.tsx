import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, ShieldCheck } from "lucide-react";

const testimonials = [
    {
        quote: "HR CoPilot changed the game for my consultancy. I used to spend 4-5 hours drafting a single disciplinary code. Now I generate the base in 60 seconds and spend my time on the actual strategy. My margins have tripled.",
        author: "Jennifer Botha",
        role: "Senior HR Consultant, Sandton",
    },
    {
        quote: "The multi-tenant dashboard is a lifesaver. I can manage 20 clients from one screen without losing track of their unique POPIA statuses. It's the infrastructure I didn't know I needed.",
        author: "Sipho Mokoena",
        role: "Founder, Mokoena & Associates",
    },
    {
        quote: "Institutional-grade documents at the touch of a button. My clients are wowed by the quality, and because I can white-label the portal, it reinforces my brand every day.",
        author: "Karin Pretorius",
        role: "Independent HR Advisor, Cape Town",
    },
];

const ConsultantTestimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/4 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                {/* Header */}
                <motion.div
                    className="mb-16 md:mb-24"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-4 py-2 mb-6 border border-primary/20">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground">Established Success</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight tracking-tighter">
                        Don't take our word for it
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Join dozens of elite South African HR consultants who have scaled their practice with HR CoPilot.
                    </p>
                </motion.div>

                {/* Testimonials grid - asymmetric like the main landing */}
                <div className="grid md:grid-cols-12 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.author}
                            className={`${index === 0
                                ? "md:col-span-7"
                                : index === 1
                                    ? "md:col-span-5"
                                    : "md:col-span-6 md:col-start-4"
                                }`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                        >
                            <div className="bg-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-soft h-full flex flex-col justify-between">
                                <div>
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-10">
                                        "{testimonial.quote}"
                                    </blockquote>
                                </div>

                                <div className="flex items-center gap-4 pt-8 border-t border-border/10">
                                    <div className="w-14 h-14 rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center text-primary font-black text-xl">
                                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-foreground leading-tight">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground font-semibold">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConsultantTestimonials;
