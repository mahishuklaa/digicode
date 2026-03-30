import { type ReactNode, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { rules, type DigiCodeRule } from "@/data/digicode-rules";
import {
  definitions,
  offencesTable,
  partCode,
  partDuties,
  partOffences,
  partPrinciples,
  partRights,
  scheduleTables,
  schedulesSection,
  type DigiCodeChapter,
  type DigiCodePartSection,
  type DigiCodePartWithArticles,
  type DigiCodeTable,
} from "@/data/digicode-structure";

type SectionFilter =
  | "all"
  | "definitions"
  | "part-1"
  | "part-2"
  | "part-3"
  | "part-4"
  | "part-5"
  | "part-6";

const sectionOptions: Array<{ value: SectionFilter; label: string }> = [
  { value: "all", label: "All Sections" },
  { value: "definitions", label: "Definitions" },
  { value: "part-1", label: "Part I - Fundamental Rights" },
  { value: "part-2", label: "Part II - Fundamental Duties" },
  { value: "part-3", label: "Part III - Offences & Penalties" },
  { value: "part-4", label: "Part IV - The Digital Code" },
  { value: "part-5", label: "Part V - General Principles" },
  { value: "part-6", label: "Part VI - Schedules" },
];

const quickJumpItems: Array<{ id: string; label: string }> = [
  { id: "preamble", label: "Preamble" },
  { id: "definitions", label: "Definitions" },
  { id: "part-1", label: "Part I - Fundamental Rights" },
  { id: "part-2", label: "Part II - Fundamental Duties" },
  { id: "part-3", label: "Part III - Offences & Penalties" },
  { id: "part-4", label: "Part IV - The Digital Code" },
  { id: "chapter-1", label: "Chapter 1 - Messaging Code" },
  { id: "chapter-2", label: "Chapter 2 - Instagram Code" },
  { id: "chapter-3", label: "Chapter 3 - Group Chat Code" },
  { id: "chapter-4", label: "Chapter 4 - Relationship Code" },
  { id: "chapter-5", label: "Chapter 5 - Conflict Code" },
  { id: "chapter-6", label: "Chapter 6 - Meme & Internet Language Code" },
  { id: "part-5", label: "Part V - General Principles" },
  { id: "part-6", label: "Part VI - Schedules" },
];

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const getClauseLabel = (index: number) => `Clause ${index + 1}`;

const matchesSearch = (search: string, values: string[]) => {
  if (!search.trim()) return true;

  const haystack = normalizeText(values.join(" "));
  const terms = normalizeText(search)
    .split(" ")
    .filter((term) => term.length > 1);

  return terms.every((term) => haystack.includes(term));
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary">
                Article {rule.article}
              </span>
            </div>
            <h4 className="mt-2 font-serif text-lg text-foreground">{rule.title}</h4>
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
              <p className="mb-1.5 text-xs font-mono tracking-[0.28em] uppercase text-primary/80">
                Interpretation
              </p>
              <p className="text-sm leading-relaxed text-secondary-foreground">
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
      <p key={paragraph} className="text-sm leading-relaxed text-secondary-foreground">
        {paragraph}
      </p>
    ))}
  </div>
);

const DocumentTable = ({ table }: { table: DigiCodeTable }) => (
  <div className="overflow-hidden rounded-md border border-border bg-card/70">
    <div className="border-b border-border bg-secondary/40 px-4 py-3">
      <h4 className="font-serif text-lg text-foreground">{table.title}</h4>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-background/60">
          <tr>
            {table.columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left font-mono text-[11px] tracking-[0.24em] uppercase text-primary/90"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")} className="border-t border-border/70">
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3 align-top text-secondary-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  ]);

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

  const matchesArticleFilter = (rule: DigiCodeRule) =>
    activeArticle === "all" || String(rule.article) === activeArticle;

  const getRulesForArticles = (articleNumbers: number[]) =>
    articleNumbers
      .map((articleNumber) => rules.find((rule) => rule.article === articleNumber))
      .filter((rule): rule is DigiCodeRule => Boolean(rule));

  const visibleDefinitions = useMemo(
    () =>
      definitions.filter(
        (definition) =>
          (activeSection === "all" || activeSection === "definitions") &&
          activeArticle === "all" &&
          matchesSearch(search, [definition.term, definition.text, `Definition ${definition.id}`]),
      ),
    [activeArticle, activeSection, search],
  );

  const visibleStandaloneArticles = (part: DigiCodePartWithArticles) =>
    getRulesForArticles(part.articleNumbers).filter(
      (rule) =>
        (activeSection === "all" || activeSection === part.id) &&
        matchesArticleFilter(rule) &&
        matchesSearch(search, [
          rule.title,
          rule.articleTitle,
          rule.clause,
          rule.interpretation,
          ...rule.clauses,
        ]),
    );

  const visibleCodeChapters = useMemo(
    () =>
      partCode.chapters
        .map((chapter) => ({
          ...chapter,
          articles: getRulesForArticles(chapter.articleNumbers).filter(
            (rule) =>
              (activeSection === "all" || activeSection === "part-4") &&
              matchesArticleFilter(rule) &&
              matchesSearch(search, [
                chapter.title,
                rule.title,
                rule.articleTitle,
                rule.clause,
                rule.interpretation,
                ...rule.clauses,
              ]),
          ),
        }))
        .filter((chapter) => chapter.articles.length > 0),
    [activeArticle, activeSection, search],
  );

  const rightsArticles = visibleStandaloneArticles(partRights);
  const dutiesArticles = visibleStandaloneArticles(partDuties);
  const principleArticles = visibleStandaloneArticles(partPrinciples);

  const visiblePartOffences =
    (activeSection === "all" || activeSection === "part-3") &&
    activeArticle === "all" &&
    matchesSearch(search, [...partOffences.intro, partOffences.title, ...offencesTable.rows.flat()]);

  const visibleSchedules =
    (activeSection === "all" || activeSection === "part-6") &&
    activeArticle === "all" &&
    matchesSearch(search, [
      schedulesSection.title,
      ...schedulesSection.intro,
      ...scheduleTables.flatMap((table) => [table.title, ...table.columns, ...table.rows.flat()]),
    ]);

  const totalVisibleArticles =
    rightsArticles.length +
    dutiesArticles.length +
    principleArticles.length +
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
    children: ReactNode;
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
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-6"
      >
        <div>
          <p className="mb-2 text-xs font-mono tracking-[0.35em] uppercase text-primary">{label}</p>
          <h3 className="text-2xl font-serif text-foreground md:text-3xl">{title}</h3>
          {count && <p className="mt-2 text-sm text-secondary-foreground">{count}</p>}
        </div>
        <div className="mt-1 text-muted-foreground">
          {isSectionOpen(id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isSectionOpen(id) && (
        <div className="border-t border-border px-5 pb-5 pt-5 md:px-6 md:pb-6">{children}</div>
      )}
    </motion.section>
  );

  return (
    <section id="database" className="scroll-mt-20 px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-xs font-mono uppercase tracking-[0.4em] text-primary">
            The Code Archive
          </h2>
          <p className="text-2xl font-serif text-foreground md:text-3xl">The Digi-Code Constitution</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/80">Articles</p>
              <p className="mt-1 text-2xl font-serif text-primary">85</p>
            </div>
            <div className="rounded-md border border-border bg-card/60 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/80">Definitions</p>
              <p className="mt-1 text-2xl font-serif text-foreground">{definitions.length}</p>
            </div>
            <div className="rounded-md border border-border bg-card/60 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/80">Principles</p>
              <p className="mt-1 text-2xl font-serif text-foreground">{partPrinciples.articleNumbers.length}</p>
            </div>
            <div className="rounded-md border border-border bg-card/60 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/80">Schedules</p>
              <p className="mt-1 text-2xl font-serif text-foreground">{scheduleTables.length}</p>
            </div>
            <div className="rounded-md border border-border bg-card/60 px-4 py-3">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-primary/80">Chapters</p>
              <p className="mt-1 text-2xl font-serif text-foreground">{partCode.chapters.length}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="space-y-4 rounded-md border border-border bg-card/60 p-4">
              <div>
                <p className="mb-3 text-xs font-mono uppercase tracking-[0.35em] text-primary">
                  Document Jump
                </p>
                <div className="space-y-2">
                  {quickJumpItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                      className="w-full text-left text-xs font-mono uppercase tracking-wider text-secondary-foreground transition-colors hover:text-primary"
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
                  onClick={() => setExpandedSections(["definitions", "part-1", "part-2", "part-3", "part-4", "part-5", "part-6"])}
                  className="w-full text-left text-xs font-mono uppercase tracking-wider text-secondary-foreground transition-colors hover:text-primary"
                >
                  Expand Sections
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSections([])}
                  className="w-full text-left text-xs font-mono uppercase tracking-wider text-secondary-foreground transition-colors hover:text-primary"
                >
                  Collapse Sections
                </button>
                <button
                  type="button"
                  onClick={() => setExpandAllArticles((prev) => !prev)}
                  className="w-full text-left text-xs font-mono uppercase tracking-wider text-secondary-foreground transition-colors hover:text-primary"
                >
                  {expandAllArticles ? "Collapse Articles" : "Expand Articles"}
                </button>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 rounded-md border border-border bg-card/50 p-4 md:p-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(230px,0.9fr)_minmax(240px,1fr)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Search exact topics, articles, clauses, or tables..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-md border border-border bg-background py-3 pl-10 pr-4 text-sm font-body text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none"
                  />
                </div>

                <select
                  value={activeSection}
                  onChange={(event) => setActiveSection(event.target.value as SectionFilter)}
                  className="rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
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
                  className="rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
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
                <p className="text-xs font-mono text-secondary-foreground">
                  {totalVisibleArticles} visible articles, {visibleDefinitions.length} visible definitions
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveSection("all");
                    setActiveArticle("all");
                  }}
                  className="text-xs font-mono uppercase tracking-wider text-secondary-foreground transition-colors hover:text-primary"
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
                      <p className="text-sm leading-relaxed text-secondary-foreground">
                        For the purposes of this Constitution, the following terms shall have the meanings assigned to them:
                      </p>
                      <div className="space-y-4">
                        {visibleDefinitions.map((definition) => (
                          <div key={definition.id} className="border-l border-primary/20 py-1 pl-4 md:pl-6">
                            <p className="mb-1 text-xs font-mono uppercase tracking-[0.28em] text-primary/80">
                              Definition {definition.id}
                            </p>
                            <h4 className="font-serif text-lg text-foreground">{definition.term}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">
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
                  children: (
                    <div className="space-y-5">
                      <SectionIntro section={partOffences} />
                      <DocumentTable table={offencesTable} />
                    </div>
                  ),
                })}

              {(activeSection === "all" || activeSection === "part-4") &&
                renderSectionShell({
                  id: "part-4",
                  label: partCode.label,
                  title: partCode.title,
                  count: `${visibleCodeChapters.reduce((count, chapter) => count + chapter.articles.length, 0)} visible articles`,
                  children: (
                    <div className="space-y-6">
                      {visibleCodeChapters.map((chapter: DigiCodeChapter) => (
                        <div key={chapter.id} id={chapter.id} className="scroll-mt-24 space-y-3">
                          <div className="border-b border-border/60 pb-2">
                            <p className="mb-1 text-xs font-mono uppercase tracking-[0.3em] text-primary/80">
                              {chapter.label}
                            </p>
                            <h4 className="font-serif text-lg text-foreground">{chapter.title}</h4>
                          </div>
                          <div className="space-y-3 md:pl-4">
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
                    <div className="space-y-5">
                      <SectionIntro section={schedulesSection} />
                      {scheduleTables.map((table) => (
                        <DocumentTable key={table.title} table={table} />
                      ))}
                    </div>
                  ),
                })}
            </div>

            {visibleDefinitions.length === 0 &&
              totalVisibleArticles === 0 &&
              !visiblePartOffences &&
              !visibleSchedules && (
                <div className="py-16 text-center text-sm font-body text-secondary-foreground">
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
