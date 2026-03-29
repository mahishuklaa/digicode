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
              "We, the users of digital platforms, in order to maintain social order,
              regulate perception, and navigate constant visibility, establish this
              Constitution of DigiCode. Though unwritten, these rules govern interaction,
              identity, and power in digital life."
            </p>
          </div>
          <div className="line-ornament w-full mt-12" />
        </motion.div>
      </div>
    </section>
  );
};

export default PreambleSection;
