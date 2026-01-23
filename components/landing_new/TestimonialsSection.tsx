import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import thaboImg from "@/assets/testimonial-thabo.png";
import sarahImg from "@/assets/testimonial-sarah.png";
import kagisoImg from "@/assets/testimonial-kagiso.png";

const testimonials = [
  {
    quote: "We were spending R15k a month on HR consultants. Now we pay R62 and honestly get better results. The compliance checks are what sold me.",
    author: "Thabo Molefe",
    role: "MD, TechStart Johannesburg",
    image: thaboImg,
  },
  {
    quote: "Finally, HR software that speaks South African. The POPIA templates alone saved us weeks of work. Fantastic product.",
    author: "Sarah van der Berg",
    role: "HR Manager, Cape Creatives",
    image: sarahImg,
  },
  {
    quote: "As a startup founder, I had zero HR knowledge. HR CoPilot walked me through everything like I was explaining to my gran. Love it.",
    author: "Kagiso Nkosi",
    role: "Founder, Fresh Eats Durban",
    image: kagisoImg,
  },
];

const TestimonialsSection = () => {
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
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            Don't take our word for it
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Here's what actual SA business owners are saying.
          </p>
        </motion.div>

        {/* Testimonials grid - asymmetric */}
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
              <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-soft h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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

export default TestimonialsSection;
