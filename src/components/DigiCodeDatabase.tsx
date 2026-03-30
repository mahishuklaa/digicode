import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { rules, type DigiCodeRule } from "@/data/digicode-rules";
import {
  conclusionSection,
  definitions,
  partCode,
  partDuties,
  partOffences,
  partPrinciples,
  partRights,
  schedulesSection,
  type DigiCodeChapter,
  type DigiCodePartSection,
  type DigiCodePartWithArticles,
} from "@/data/digicode-structure";

type SectionFilter =
  | "all"
  | "definitions"
  | "part-1"
  | "part-2"
  | "part-3"
  | "part-4"
  | "part-5"
  | "part-6"
  | "conclusion";

const sectionOptions: Array<{ value: SectionFilter; label: string }> = [
  { value: "all", label: "All Sections" },
  { value: "definitions", label: "Definitions" },
  { value: "part-1", label: "Part I: Rights" },
  { value: "part-2", label: "Part II: Duties" },
  { value: "part-3", label: "Part III: Offences" },
  { value: "part-4", label: "Part IV: Digital Code" },
  { value: "part-5", label: "Part V: Principles" },
  { value: "part-6", label: "Part VI: Schedules" },
  { value: "conclusion", label: "Conclusion" },
];

const quickJumpItems: Array<{ id: string; label: string }> = [
  { id: "definitions", label: "Definitions" },
  { id: "part-1", label: "Rights" },
  { id: "part-2", label: "Duties" },
  { id: "part-3", label: "Penalties" },
  { id: "part-4", label: "Digital Code" },
  { id: "part-5", label: "Principles" },
  { id: "part-6", label: "Schedules" },
  { id: "conclusion", label: "Conclusion" },
];

const normalizeText = (value: string) => value.toLowerCase();

const getClauseLabel = (index: number) => `Clause ${index + 1}`;

const matchesSearch = (search: string, values: string[]) => {
  if (!search) return true;
  const normalizedSearch = normalizeText(search);
  return values.some((value) => normalizeText(value).includes(normalizedSearch));
};

const ArticleEntry = ({
  rule,
  forceOpen,
}: {
  rule: DigiCodeRule;
  forceOpen: boolean;
}) => {
  const articleValue = `article-${rule.id}`;

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
              <span className="text-xs text-muted-foreground">{rule.title}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {rule.clauses[0] ?? rule.clause}
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

const SectionIntro = ({ section }: { section: DigiCodePartSection }) => (
  <div className="space-y-3">
    {section.intro.map((paragraph) => (
      <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
        {paragraph}
      </p>
    ))}
  </div>
);

const DigiCodeDatabase = () => {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<SectionFilter>("all");
  const [activeArticle, setActiveArticle] = useState("all");
  const [expandAllArticles, setExpandAllArticles] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "definitions",
    "part-1",
    "part-2",
    "part-3",
    "part-4",
    "part-5",
    "part-6",
    "conclusion",
  ]);

  const articleMap = useMemo(() => new Map(rules.map((rule) => [rule.article, rule])), []);

  const articleOptions = useMemo(
    () =>
      [...rules]
        .sort((a, b) => a.article - b.article)
        .map((rule) => ({
          value: String(rule.article),
          label: `Article ${rule.article}: ${rule.title}`,
        })),
    [],
  );

  const visibleDefinitions = useMemo(
    () =>
      definitions.filter((definition) =>
        matchesSearch(search, [definition.term, definition.text, `Definition ${definition.id}`]),
      ),
    [search],
  );

  const visibleStandaloneArticles = (part: DigiCodePartWithArticles) =>
    part.articleNumbers
      .map((articleNumber) => articleMap.get(articleNumber))
      .filter((rule): rule is DigiCodeRule => Boolean(rule))
      .filter((rule) => {
        const matchesSection = activeSection === "all" || activeSection === part.id;
        const matchesArticle = activeArticle === "all" || String(rule.article) === activeArticle;
        const matchesText = matchesSearch(search, [
          rule.title,
          rule.articleTitle,
          rule.clause,
          rule.interpretation,
          ...rule.clauses,
        ]);
        return matchesSection && matchesArticle && matchesText;
      });

  const visibleCodeChapters = useMemo(
    () =>
      partCode.chapters
        .map((chapter) => {
          const articles = chapter.articleNumbers
            .map((articleNumber) => articleMap.get(articleNumber))
            .filter((rule): rule is DigiCodeRule => Boolean(rule))
            .filter((rule) => {
              const matchesSection = activeSection === "all" || activeSection === "part-4";
              const matchesArticle = activeArticle === "all" || String(rule.article) === activeArticle;
              const matchesText = matchesSearch(search, [
                chapter.title,
                rule.title,
                rule.articleTitle,
                rule.clause,
                rule.interpretation,
                ...rule.clauses,
              ]);
              return matchesSection && matchesArticle && matchesText;
            });

          return { ...chapter, articles };
        })
        .filter((chapter) => chapter.articles.length > 0),
    [activeArticle, activeSection, articleMap, search],
  );

  const rightsArticles = visibleStandaloneArticles(partRights);
  const dutiesArticles = visibleStandaloneArticles(partDuties);
  const principleArticles = visibleStandaloneArticles(partPrinciples);

  const visiblePartOffences =
    (activeSection === "all" || activeSection === "part-3") &&
    activeArticle === "all" &&
    matchesSearch(search, [...partOffences.intro, partOffences.title]);

  const visibleSchedules =
    (activeSection === "all" || activeSection === "part-6") &&
    activeArticle === "all" &&
    matchesSearch(search, [...schedulesSection.intro, schedulesSection.title]);

  const visibleConclusion =
    (activeSection === "all" || activeSection === "conclusion") &&
    activeArticle === "all" &&
    matchesSearch(search, [...conclusionSection.intro, conclusionSection.title]);

  const totalVisibleArticles =
    rightsArticles.length + dutiesArticles.length + principleArticles.length +
    visibleCodeChapters.reduce((count, chapter) => count + chapter.articles.length, 0);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((item) => item !== sectionId) : [...prev, sectionId],
    );
  };

  const isSectionOpen = (sectionId: string) => expandedSections.includes(sectionId);

  const renderSectionShell = ({
    id,
    label,
    title,
    count,
    children,
  }: {
    id: string;
    label: string;
    title: string;
    count?: string;
    children: React.ReactNode;
  }) => (
    <motion.section
      id={id}
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="scroll-mt-24 rounded-md border border-border bg-card/40"
    >
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full px-5 py-5 md:px-6 flex items-start justify-between gap-4 text-left"
      >
        <div>
          <p className="text-xs font-mono tracking-[0.35em] uppercase text-primary mb-2">
            {label}
          </p>
          <h3 className="text-2xl md:text-3xl font-serif text-foreground">{title}</h3>
          {count && <p className="mt-2 text-sm text-muted-foreground">{count}</p>}
        </div>
        <div className="mt-1 text-muted-foreground">
          {isSectionOpen(id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isSectionOpen(id) && (
        <div className="border-t border-border px-5 pb-5 md:px-6 md:pb-6 pt-5">
          {children}
        </div>
      )}
    </motion.section>
  );

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
            Structured in the order of the Digi-Code Constitution.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/5 border border-primary/20">
            <span className="text-2xl font-serif font-bold text-primary">85</span>
            <span className="text-sm text-muted-foreground font-body">
              Articles, Definitions, Principles, and Schedules Cross-Checked
            </span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-md border border-border bg-card/60 p-4 space-y-4">
              <div>
                <p className="text-xs font-mono tracking-[0.35em] uppercase text-primary mb-3">
                  Document Jump
                </p>
                <div className="space-y-2">
                  {quickJumpItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
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
                  onClick={() => setExpandedSections(quickJumpItems.map((item) => item.id))}
                  className="w-full text-left text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Expand Sections
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSections([])}
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
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.9fr)_minmax(220px,1fr)]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search definitions, parts, articles, or clauses..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <select
                  value={activeSection}
                  onChange={(event) => setActiveSection(event.target.value as SectionFilter)}
                  className="bg-background border border-border rounded-md px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {sectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={activeArticle}
                  onChange={(event) => setActiveArticle(event.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">All Articles</option>
                  {articleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground font-mono">
                  {totalVisibleArticles} visible articles, {visibleDefinitions.length} visible definitions
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveSection("all");
                    setActiveArticle("all");
                  }}
                  className="text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {(activeSection === "all" || activeSection === "definitions") &&
                visibleDefinitions.length > 0 &&
                renderSectionShell({
                  id: "definitions",
                  label: "Definitions",
                  title: "Definitions",
                  count: `${visibleDefinitions.length} definitions`,
                  children: (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        For the purposes of this Constitution, the following terms shall have the meanings assigned to them:
                      </p>
                      <div className="space-y-4">
                        {visibleDefinitions.map((definition) => (
                          <div
                            key={definition.id}
                            className="border-l border-primary/20 pl-4 md:pl-6 py-1"
                          >
                            <p className="text-xs font-mono tracking-[0.28em] uppercase text-primary/80 mb-1">
                              Definition {definition.id}
                            </p>
                            <h4 className="font-serif text-lg text-foreground">{definition.term}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-foreground">
                              {definition.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                })}

              {(activeSection === "all" || activeSection === "part-1") &&
                (rightsArticles.length > 0 || matchesSearch(search, [partRights.title, ...partRights.intro])) &&
                renderSectionShell({
                  id: "part-1",
                  label: partRights.label,
                  title: partRights.title,
                  count: `${rightsArticles.length} visible articles`,
                  children: (
                    <div className="space-y-5">
                      <SectionIntro section={partRights} />
                      <div className="space-y-3">
                        {rightsArticles.map((rule) => (
                          <ArticleEntry key={rule.id} rule={rule} forceOpen={expandAllArticles} />
                        ))}
                      </div>
                    </div>
                  ),
                })}

              {(activeSection === "all" || activeSection === "part-2") &&
                (dutiesArticles.length > 0 || matchesSearch(search, [partDuties.title, ...partDuties.intro])) &&
                renderSectionShell({
                  id: "part-2",
                  label: partDuties.label,
                  title: partDuties.title,
                  count: `${dutiesArticles.length} visible articles`,
                  children: (
                    <div className="space-y-5">
                      <SectionIntro section={partDuties} />
                      <div className="space-y-3">
                        {dutiesArticles.map((rule) => (
                          <ArticleEntry key={rule.id} rule={rule} forceOpen={expandAllArticles} />
                        ))}
                      </div>
                    </div>
                  ),
                })}

              {visiblePartOffences &&
                renderSectionShell({
                  id: "part-3",
                  label: partOffences.label,
                  title: partOffences.title,
                  children: <SectionIntro section={partOffences} />,
                })}

              {(activeSection === "all" || activeSection === "part-4") &&
                (visibleCodeChapters.length > 0 || activeSection === "part-4") &&
                renderSectionShell({
                  id: "part-4",
                  label: partCode.label,
                  title: partCode.title,
                  count: `${visibleCodeChapters.reduce((count, chapter) => count + chapter.articles.length, 0)} visible articles`,
                  children: (
                    <div className="space-y-6">
                      {visibleCodeChapters.map((chapter: DigiCodeChapter) => (
                        <div key={chapter.id} className="space-y-3">
                          <div className="pb-2 border-b border-border/60">
                            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary/80 mb-1">
                              {chapter.label}
                            </p>
                            <h4 className="font-serif text-lg text-foreground">{chapter.title}</h4>
                          </div>
                          <div className="space-y-3 pl-0 md:pl-4">
                            {chapter.articles.map((rule) => (
                              <ArticleEntry key={rule.id} rule={rule} forceOpen={expandAllArticles} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                })}

              {(activeSection === "all" || activeSection === "part-5") &&
                (principleArticles.length > 0 || matchesSearch(search, [partPrinciples.title, ...partPrinciples.intro])) &&
                renderSectionShell({
                  id: "part-5",
                  label: partPrinciples.label,
                  title: partPrinciples.title,
                  count: `${principleArticles.length} visible articles`,
                  children: (
                    <div className="space-y-5">
                      <SectionIntro section={partPrinciples} />
                      <div className="space-y-3">
                        {principleArticles.map((rule) => (
                          <ArticleEntry key={rule.id} rule={rule} forceOpen={expandAllArticles} />
                        ))}
                      </div>
                    </div>
                  ),
                })}

              {visibleSchedules &&
                renderSectionShell({
                  id: "part-6",
                  label: schedulesSection.label,
                  title: schedulesSection.title,
                  children: (
                    <div className="space-y-3">
                      {schedulesSection.intro.map((item) => (
                        <p key={item} className="text-sm leading-relaxed text-foreground border-l border-primary/20 pl-4 md:pl-6">
                          {item}
                        </p>
                      ))}
                    </div>
                  ),
                })}

              {visibleConclusion &&
                renderSectionShell({
                  id: "conclusion",
                  label: conclusionSection.label,
                  title: conclusionSection.title,
                  children: <SectionIntro section={conclusionSection} />,
                })}
            </div>

            {visibleDefinitions.length === 0 &&
              totalVisibleArticles === 0 &&
              !visiblePartOffences &&
              !visibleSchedules &&
              !visibleConclusion && (
                <div className="text-center py-16 text-muted-foreground font-body text-sm">
                  No sections match your search. The archive remains silent on this point.
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigiCodeDatabase;
