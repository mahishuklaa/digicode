import { motion } from "framer-motion";

const InterpretationSection = () => {
  return (
    <section id="interpretation" className="py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="line-ornament w-24 mx-auto mb-12" />
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-6">Final Interpretation</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
            On the Nature of DigiCode
          </h3>
          <p className="text-lg text-secondary-foreground font-serif italic leading-relaxed mb-8">
            "These rules are not formally enforced, yet they regulate behaviour through
            visibility, expectation, and internalised norms. Digital culture operates
            through systems of informal control."
          </p>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xl mx-auto">
            The Constitution of DigiCode does not claim to prescribe behaviour. It merely
            observes the invisible architecture of digital interaction — the unspoken
            agreements, the silent judgments, the power encoded in every tap, scroll, and swipe.
          </p>
          <div className="line-ornament w-24 mx-auto mt-12" />
          <p className="text-xs font-mono tracking-[0.3em] text-muted-foreground mt-8 uppercase">
            — Ratified in the age of infinite scroll —
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InterpretationSection;
