import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        quote: "HR CoPilot transformed my solo practice into a tech-enabled agency. I produced more in one month than I did in the entire previous quarter, with zero legal anxiety.",
        author: "Sarah Mvuyana",
        role: "Independent HR Consultant, Cape Town",
        stats: "300% Growth in Client Capacity"
    },
    {
        quote: "The white-labeling is seamless. My clients think I've invested millions in my own tech stack. It's the ultimate competitive advantage for a small boutique agency.",
        author: "Johan Pretorius",
        role: "Director, Pretoria HR Solutions",
        stats: "R250k saved in drafting time"
    },
    {
        quote: "Finally, a platform that understands South African labour law. The automatic updates on BCEA and LRA changes mean I never have to worry about outdated templates again.",
        author: "Nomsa Dladla",
        role: "Senior Consultant, Durban Compliance Group",
        stats: "Zero compliance errors recorded"
    },
];

const ConsultantTestimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                {/* Header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        Trusted by the <br />
                        <span className="text-primary">Best in the Business</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium">
                        Join the community of elite South African HR professionals scaling their impact with HR CoPilot.
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.author}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full group"
                        >
                            {/* Quote Icon */}
                            <div className="mb-8">
                                <Quote className="w-10 h-10 text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <blockquote className="text-xl text-slate-800 leading-relaxed mb-8 flex-grow font-semibold">
                                "{testimonial.quote}"
                            </blockquote>

                            <div className="pt-8 border-t border-slate-50 mt-auto">
                                <p className="font-black text-slate-900 text-lg leading-tight">{testimonial.author}</p>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1 mb-4">{testimonial.role}</p>

                                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-tighter">{testimonial.stats}</span>
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
