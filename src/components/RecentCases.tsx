import { motion } from "framer-motion";
import { recentCases } from "@/data/digicode-rules";

const RecentCases = () => {
  return (
    <section id="cases" className="py-24 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">Case Archive</h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground">Recent Cases</p>
        </motion.div>

        <div className="space-y-3">
          {recentCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-border bg-card rounded-md p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">Case #{c.id}</span>
                  <h3 className="font-serif text-base font-semibold text-foreground mt-0.5">{c.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{c.section}</span>
                </div>
                <span className={`text-xs font-mono tracking-wider uppercase px-2.5 py-1 rounded-sm border whitespace-nowrap ${
                  c.result === "Violation Confirmed"
                    ? "border-destructive text-destructive"
                    : "border-green-800 text-green-500"
                }`}>
                  {c.result}
                </span>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed">{c.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentCases;
