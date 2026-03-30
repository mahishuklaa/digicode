import { motion } from "framer-motion";

const PreambleSection = () => {
  return (
    <section id="preamble" className="py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-8">
            Preamble
          </h2>
          <div className="border-l-2 border-gold-dim pl-8">
            <p className="text-lg md:text-xl leading-relaxed text-secondary-foreground font-serif italic">
              "We, the Users of the Digital World, in order to maintain social order,
              prevent unnecessary overthinking, preserve online reputation, maintain streaks,
              respond within socially acceptable time frames, and prevent the misuse of 'seen',
              do hereby establish this Digi-Code Constitution."
            </p>
            <p className="text-base leading-relaxed text-muted-foreground font-body mt-6">
              This Constitution recognises that digital platforms are not merely tools of
              communication, but function as societies with their own norms, expectations,
              languages, hierarchies, and power structures.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground font-body mt-6">
              This Constitution seeks to formalise the implicit rules governing digital interaction
              and to provide a structured understanding of behaviour within digital society.
            </p>
          </div>
          <div className="line-ornament w-full mt-12" />
        </motion.div>
      </div>
    </section>
  );
};

export default PreambleSection;
