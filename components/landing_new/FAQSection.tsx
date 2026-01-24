import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is this actually legal? Like, properly legal?",
    answer: "Yep. Our documents are developed with SA labour law experts and continuously updated for BCEA, LRA, and POPIA changes. We're not replacing lawyers — we're just making sure your everyday HR docs are compliant.",
  },
  {
    question: "Can I tweak the documents?",
    answer: "100%. Everything's fully editable. Our AI guides you through smart customizations while keeping you within legal guardrails. Think of it as training wheels that won't let you fall off.",
  },
  {
    question: "What about my data? Is it safe?",
    answer: "We're POPIA compliant (obviously — we help you with POPIA, after all). All data is encrypted, never shared with third parties, and you own everything you create. No dodgy stuff.",
  },
  {
    question: "I've got 10 employees. Is this overkill?",
    answer: "Nope, it's perfect. We built this specifically for SMEs with 5-200 employees. The enterprise stuff is for the big guys. Starter plan at R299/month is literally cheaper than one hour with an HR consultant.",
  },
  {
    question: "What if I need help implementing something?",
    answer: "Pro and Enterprise plans include priority support. Enterprise gets a dedicated account manager and training. But honestly, most of our users figure it out in about 10 minutes.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute bottom-0 right-0 w-[50%] h-[70%] bg-accent/20"
        style={{ clipPath: "polygon(100% 30%, 100% 100%, 20% 100%)" }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left side - Header */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Questions?
              <br />
              <span className="text-gradient">Answers.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Still got questions? Hit us up at{" "}
              <a href="mailto:hello@hrcopilot.co.za" className="text-primary hover:underline">
                hello@hrcopilot.co.za
              </a>
            </p>
          </motion.div>

          {/* Right side - FAQs */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left bg-card rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      {openIndex === index ? (
                        <Minus className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? "auto" : 0,
                      opacity: openIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground pt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
