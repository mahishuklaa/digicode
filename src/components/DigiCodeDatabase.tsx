import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { rules, categories, tags, type DigiCodeCategory, type DigiCodeTag, type DigiCodeRule } from "@/data/digicode-rules";

const RuleCard = ({ rule }: { rule: DigiCodeRule }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border border-border bg-card rounded-md overflow-hidden hover:border-gold-dim transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-primary">§ {rule.section}</span>
            <span className="text-xs text-muted-foreground">Article {rule.article}</span>
          </div>
          <h3 className="font-serif text-base font-semibold text-foreground">{rule.title}</h3>
          {!expanded && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{rule.clause}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-muted-foreground mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-primary mb-1.5">Clause</h4>
                <p className="text-sm text-foreground leading-relaxed">{rule.clause}</p>
              </div>
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-primary mb-1.5">Interpretation</h4>
                <p className="text-sm text-secondary-foreground leading-relaxed italic">{rule.interpretation}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rule.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DigiCodeDatabase = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DigiCodeCategory | "All">("All");
  const [activeTags, setActiveTags] = useState<DigiCodeTag[]>([]);

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = search === "" ||
        rule.title.toLowerCase().includes(search.toLowerCase()) ||
        rule.clause.toLowerCase().includes(search.toLowerCase()) ||
        rule.interpretation.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || rule.category === activeCategory;
      const matchesTags = activeTags.length === 0 || activeTags.some(t => rule.tags.includes(t));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [search, activeCategory, activeTags]);

  const toggleTag = (tag: DigiCodeTag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <section id="database" className="py-24 md:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">DigiCode Database</h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground">The Complete Registry of Digital Laws</p>
          <p className="text-sm text-muted-foreground mt-2 font-body">{rules.length} articles codified · 5 governing categories</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search the DigiCode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["All", ...categories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded-sm border transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-gold-dim hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-sm border transition-colors ${
                activeTags.includes(tag)
                  ? "border-gold-dim bg-secondary text-foreground"
                  : "border-border text-muted-foreground hover:text-secondary-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground font-mono mb-4">
          {filteredRules.length} of {rules.length} articles
        </p>

        {/* Rules Grid */}
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {filteredRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </AnimatePresence>
          {filteredRules.length === 0 && (
            <div className="text-center py-16 text-muted-foreground font-body text-sm">
              No articles match your query. The DigiCode remains silent on this matter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DigiCodeDatabase;
