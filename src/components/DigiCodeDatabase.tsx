import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { categories, rules, type DigiCodeCategory, type DigiCodeRule } from "@/data/digicode-rules";

type FilterCategory = DigiCodeCategory | "All";

interface GroupedRule extends DigiCodeRule {
  clauses: string[];
}

interface ChapterGroup {
  title: string;
  articles: GroupedRule[];
}

interface CategoryGroup {
  category: DigiCodeCategory;
  chapters: ChapterGroup[];
  articleCount: number;
}

const quickJumpItems: { label: string; category: DigiCodeCategory; id: string }[] = [
  { label: "Messaging", category: "Messaging", id: "category-messaging" },
  { label: "Social Media", category: "Social Media", id: "category-social-media" },
  { label: "Group Chats", category: "Group Chats", id: "category-group-chats" },
  { label: "Identity", category: "Identity & Behaviour", id: "category-identity-behaviour" },
  { label: "Power", category: "Power Moves", id: "category-power-moves" },
];

const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const buildArticleValue = (rule: DigiCodeRule) => `article-${rule.id}`;

const buildCategoryValue = (category: DigiCodeCategory) => `category-${slugify(category)}`;

const getClauseLabel = (index: number) => `Clause (${String.fromCharCode(97 + index)})`;

const ArticleEntry = ({
  rule,
  forceOpen,
}: {
  rule: GroupedRule;
  forceOpen: boolean;
}) => {
  const articleValue = buildArticleValue(rule);

  return (
    <Accordion
      type="multiple"
      value={forceOpen ? [articleValue] : undefined}
      className="rounded-md border border-border bg-card/70"
    >
      <AccordionItem value={articleValue} className="border-b-0">
        <AccordionTrigger className="px-5 py-4 hover:no-underline">
          <div className="min-w-0 text-left">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary">
                Article {rule.article}
              </span>
              <span className="text-xs text-muted-foreground">Section {rule.section}</span>
            </div>
            <h4 className="font-serif text-lg text-foreground">{rule.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {rule.clauses[0]}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-5">
          <div className="border-l border-primary/20 pl-4 md:pl-6">
            <ol className="space-y-4">
              {rule.clauses.map((clause, index) => (
                <li key={`${rule.id}-${index}`} className="space-y-1">
                  <p className="text-xs font-mono tracking-[0.28em] uppercase text-primary/80">
                    {getClauseLabel(index)}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">{clause}</p>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-border/70 pt-4">
              <p className="text-xs font-mono tracking-[0.28em] uppercase text-primary/80 mb-1.5">
                Interpretation
              </p>
              <p className="text-sm leading-relaxed italic text-secondary-foreground">
                {rule.interpretation}
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const DigiCodeDatabase = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [activeArticle, setActiveArticle] = useState("All");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(buildCategoryValue),
  );
  const [expandAllArticles, setExpandAllArticles] = useState(false);

  const articleOptions = useMemo(() => {
    const articleMap = new Map<string, string>();

    rules.forEach((rule) => {
      if (activeCategory === "All" || rule.category === activeCategory) {
        articleMap.set(rule.id, `Article ${rule.article}: ${rule.title}`);
      }
    });

    return Array.from(articleMap.entries()).map(([value, label]) => ({ value, label }));
  }, [activeCategory]);

  useEffect(() => {
    if (activeArticle !== "All" && !articleOptions.some((option) => option.value === activeArticle)) {
      setActiveArticle("All");
    }
  }, [activeArticle, articleOptions]);

  const filteredRules = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rules.filter((rule) => {
      const matchesCategory = activeCategory === "All" || rule.category === activeCategory;
      const matchesArticle = activeArticle === "All" || rule.id === activeArticle;
      const matchesSearch =
        normalizedSearch === "" ||
        rule.title.toLowerCase().includes(normalizedSearch) ||
        rule.clause.toLowerCase().includes(normalizedSearch) ||
        rule.articleTitle.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesArticle && matchesSearch;
    });
  }, [activeArticle, activeCategory, search]);

  const structuredRules = useMemo<CategoryGroup[]>(() => {
    return categories
      .map((category) => {
        const categoryRules = filteredRules.filter((rule) => rule.category === category);
        const chapterMap = new Map<string, GroupedRule[]>();

        categoryRules.forEach((rule) => {
          const chapterRules = chapterMap.get(rule.articleTitle) ?? [];
          chapterRules.push({ ...rule, clauses: rule.clauses.length > 0 ? rule.clauses : [rule.clause] });
          chapterMap.set(rule.articleTitle, chapterRules);
        });

        return {
          category,
          chapters: Array.from(chapterMap.entries()).map(([title, articles]) => ({
            title,
            articles,
          })),
          articleCount: categoryRules.length,
        };
      })
      .filter((group) => group.articleCount > 0);
  }, [filteredRules]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setActiveArticle("All");
  };

  const handleJumpToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCategory = (value: string) => {
    setExpandedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const handleExpandAllCategories = (expand: boolean) => {
    setExpandedCategories(
      expand ? structuredRules.map((group) => buildCategoryValue(group.category)) : [],
    );
  };

  return (
    <section id="database" className="py-24 md:py-32 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">
            The Code Archive
          </h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground">
            Unwritten. Unspoken. Universally followed.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/5 border border-primary/20">
            <span className="text-2xl font-serif font-bold text-primary">{rules.length}</span>
            <span className="text-sm text-muted-foreground font-body">Total Rules Documented</span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-md border border-border bg-card/60 p-4 space-y-4">
              <div>
                <p className="text-xs font-mono tracking-[0.35em] uppercase text-primary mb-3">
                  Quick Jump
                </p>
                <div className="space-y-2">
                  {quickJumpItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleJumpToCategory(item.id)}
                      className="w-full text-left text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="line-ornament w-full" />

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleExpandAllCategories(true)}
                  className="w-full text-left text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Expand Sections
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAllCategories(false)}
                  className="w-full text-left text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Collapse Sections
                </button>
                <button
                  type="button"
                  onClick={() => setExpandAllArticles((prev) => !prev)}
                  className="w-full text-left text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  {expandAllArticles ? "Collapse Articles" : "Expand Articles"}
                </button>
              </div>
            </div>
          </aside>

          <div>
            <div className="rounded-md border border-border bg-card/50 p-4 md:p-5 mb-8">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.8fr)_minmax(200px,0.9fr)]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search article titles or clause text..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value as FilterCategory)}
                  className="bg-background border border-border rounded-md px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={activeArticle}
                  onChange={(event) => setActiveArticle(event.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="All">All Articles</option>
                  {articleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground font-mono">
                  {filteredRules.length} of {rules.length} rules
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {structuredRules.map((group) => {
                const categoryValue = buildCategoryValue(group.category);
                const isOpen = expandedCategories.includes(categoryValue);
                const jumpId =
                  quickJumpItems.find((item) => item.category === group.category)?.id ?? categoryValue;

                return (
                  <motion.section
                    key={group.category}
                    id={jumpId}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45 }}
                    className="scroll-mt-24 rounded-md border border-border bg-card/40"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(categoryValue)}
                      className="w-full px-5 py-5 md:px-6 flex items-start justify-between gap-4 text-left"
                    >
                      <div>
                        <p className="text-xs font-mono tracking-[0.35em] uppercase text-primary mb-2">
                          Chapter
                        </p>
                        <h3 className="text-2xl md:text-3xl font-serif text-foreground">
                          {group.category}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {group.articleCount} article{group.articleCount === 1 ? "" : "s"} documented
                        </p>
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-border px-5 pb-5 md:px-6 md:pb-6">
                        <div className="space-y-6 pt-5">
                          {group.chapters.map((chapter) => (
                            <div key={`${group.category}-${chapter.title}`} className="space-y-3">
                              <div className="pb-2 border-b border-border/60">
                                <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary/80 mb-1">
                                  Article Group
                                </p>
                                <h4 className="font-serif text-lg text-foreground">
                                  {chapter.title}
                                </h4>
                              </div>
                              <div className="space-y-3">
                                {chapter.articles.map((rule) => (
                                  <ArticleEntry
                                    key={rule.id}
                                    rule={rule}
                                    forceOpen={expandAllArticles}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.section>
                );
              })}
            </div>
          </div>
        </div>

        {structuredRules.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body text-sm">
            No rules match your search. The Code remains silent on this matter.
          </div>
        )}
      </div>
    </section>
  );
};

export default DigiCodeDatabase;
