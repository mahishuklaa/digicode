import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { rules, categories, tags, type DigiCodeCategory, type DigiCodeTag, type DigiCodeRule, type DigiCodeSort } from "@/data/digicode-rules";

const sortOptions: { value: DigiCodeSort; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "relatable", label: "Most Relatable" },
  { value: "chaotic", label: "Most Chaotic" },
  { value: "violated", label: "Most Violated" },
];

const RuleCard = ({ rule }: { rule: DigiCodeRule }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border border-border bg-card rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.15)] hover:-translate-y-0.5"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-primary">Article {rule.article}</span>
            <span className="text-xs text-muted-foreground">§ {rule.section}</span>
          </div>
          <h3 className="font-serif text-base font-semibold text-foreground">{rule.title}</h3>
          {!expanded && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{rule.clause}</p>
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
                <h4 className="text-xs font-mono tracking-widest uppercase text-primary mb-1.5">Full Clause</h4>
                <p className="text-sm text-foreground leading-relaxed">{rule.clause}</p>
              </div>
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-primary mb-1.5">Interpretation</h4>
                <p className="text-sm text-secondary-foreground leading-relaxed italic">{rule.interpretation}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-sm bg-primary/10 text-primary">
                  {rule.articleTitle}
                </span>
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
  const [sortBy, setSortBy] = useState<DigiCodeSort>("default");

  const filteredRules = useMemo(() => {
    let filtered = rules.filter(rule => {
      const matchesSearch = search === "" ||
        rule.title.toLowerCase().includes(search.toLowerCase()) ||
        rule.clause.toLowerCase().includes(search.toLowerCase()) ||
        rule.interpretation.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || rule.category === activeCategory;
      const matchesTags = activeTags.length === 0 || activeTags.some(t => rule.tags.includes(t));
      return matchesSearch && matchesCategory && matchesTags;
    });

    if (sortBy === "relatable") filtered.sort((a, b) => b.relatableScore - a.relatableScore);
    else if (sortBy === "chaotic") filtered.sort((a, b) => b.chaoticScore - a.chaoticScore);
    else if (sortBy === "violated") filtered.sort((a, b) => b.violatedScore - a.violatedScore);

    return filtered;
  }, [search, activeCategory, activeTags, sortBy]);

  const toggleTag = (tag: DigiCodeTag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <section id="database" className="py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">The Code Archive</h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground">Unwritten. Unspoken. Universally followed.</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/5 border border-primary/20">
            <span className="text-2xl font-serif font-bold text-primary">{rules.length}</span>
            <span className="text-sm text-muted-foreground font-body">Total Rules Documented</span>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search the Code Archive..."
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

        {/* Tag Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
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
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as DigiCodeSort)}
              className="text-xs font-mono tracking-wider uppercase bg-card border border-border rounded-sm px-2 py-1 text-muted-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground font-mono mb-4">
          {filteredRules.length} of {rules.length} rules
        </p>

        {/* Rules Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </AnimatePresence>
          {filteredRules.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground font-body text-sm">
              No rules match your search. The Code remains silent on this matter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DigiCodeDatabase;
