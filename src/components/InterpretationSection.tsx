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
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-6">Final Note</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
            Why This Exists
          </h3>
          <p className="text-lg text-secondary-foreground font-serif italic leading-relaxed mb-8">
            "These rules aren't written anywhere. But somehow, everyone knows them.
            They shape how we text, post, reply, and interpret each other —
            quietly, constantly."
          </p>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xl mx-auto">
            This Constitution does not create these rules but formally documents the
            unwritten norms that already govern behaviour in digital society. By documenting
            these norms, the Digi-Code Constitution attempts to make visible the invisible
            rules, expectations, power structures, and social behaviours that operate within
            digital communication environments.
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
