import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, Send } from "lucide-react";
import { rules, type DigiCodeRule } from "@/data/digicode-rules";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const keywordMap: Record<string, string[]> = {
  "1": ["right to reply", "timely communication", "response time right"],
  "2": ["social acknowledgment", "acknowledge my post"],
  "3": ["left on seen", "seen without reply", "explanation after seen", "read but"],
  "4": ["digital inclusion", "close friends list exclusion", "excluded from"],
  "5": ["meme communication", "right to meme"],
  "6": ["identity management", "archive right", "delete old posts"],
  "7": ["communication consistency", "suddenly changed", "communication changed"],
  "8": ["digital respect", "dry replies to serious"],
  "9": ["duty of acknowledgment"],
  "10": ["duty of engagement", "didn't like my post"],
  "11": ["group participation duty"],
  "12": ["public acknowledgment", "didn't post for my birthday"],
  "13": ["communication responsibility", "responded casually"],
  "14": ["digital courtesy", "left without telling"],
  "15": ["duty of response", "ignored my reel", "ignored my meme"],
  "16": ["reply time", "replied too fast", "replied immediately", "replied late", "slow reply", "fast reply", "quick reply"],
  "17": ["double text", "texted twice", "sent again", "multiple messages", "texted and they didn't reply"],
  "18": ["seen", "blue ticks", "opened but", "read receipt"],
  "19": ["typing", "started typing", "typing indicator", "typing bubble", "typing and stopped"],
  "20": ["dry reply", "said ok", "said hmm", "replied k", "said cool"],
  "21": ["message effort", "short reply to long", "didn't match effort"],
  "22": ["online status", "online but not replying", "was online", "active but"],
  "23": ["voice note", "voice message", "audio message", "long voice note"],
  "24": ["emoji reply", "thumbs up", "only sent emoji", "emoji instead of text"],
  "25": ["late night", "midnight", "2am", "3am", "late at night", "night message", "2:14"],
  "26": ["edited message", "message editing", "changed their message"],
  "27": ["conversation power", "less effort wins", "power in conversation"],
  "28": ["didn't like", "like regulation", "no like"],
  "29": ["comment", "generic comment", "just said nice"],
  "30": ["story", "viewed my story", "story views", "watched my story", "story reply"],
  "31": ["close friends", "private story", "removed from close friends"],
  "32": ["archive", "deleted post", "removed post", "mass archive"],
  "33": ["caption", "song lyric caption", "indirect caption"],
  "34": ["highlight", "story highlight", "removed from highlights"],
  "35": ["posting too much", "post every day", "posting frequency", "spam post"],
  "36": ["birthday", "didn't post for birthday", "birthday story"],
  "37": ["tagged", "untagged", "tag regulation"],
  "38": ["lurk", "just watching", "never talk", "passive", "silent in group"],
  "39": ["private chat", "take it to dm", "two people dominating"],
  "40": ["meme", "sent a meme", "meme revival"],
  "41": ["left the group", "left group chat", "exited the group", "group exit"],
  "42": ["reaction emoji", "reacted with", "heart react"],
  "43": ["tagging in group", "tagged me in group"],
  "44": ["ignored in group", "group ignored", "nobody replied in group"],
  "45": ["group energy", "group leader", "keeps the group alive"],
  "46": ["message flood", "spamming", "too many messages"],
  "47": ["important message ignored", "no one acknowledged"],
  "48": ["screenshot", "screenshotted", "screen shot"],
  "49": ["admin", "removed from group", "admin power"],
  "50": ["reply time changed", "replying differently now"],
  "51": ["online but not texting", "visibility trust"],
  "52": ["soft launch", "hinted at relationship"],
  "53": ["hard launch", "made it official", "public relationship"],
  "54": ["posted on story", "posted on feed", "public display"],
  "55": ["untagged photos", "removed posts together", "digital separation"],
  "56": ["indirect post", "posted lyrics", "vague story"],
  "57": ["deleted message", "this message was deleted", "unsent"],
  "58": ["birthday effort", "birthday post effort"],
  "59": ["unfollowed", "unfollow"],
  "60": ["removed follower", "removed me as follower"],
  "61": ["blocked", "block"],
  "62": ["screenshot evidence", "showed screenshots"],
  "63": ["reply behaviour changed", "suddenly slow"],
  "64": ["dry reply conflict", "said fine", "said ok during fight"],
  "65": ["indirect conflict", "posted about me", "vague post about"],
  "66": ["emoji meaning", "emoji language"],
  "67": ["gif", "reaction image"],
  "68": ["sent memes", "meme bonding"],
  "69": ["lol", "omg", "brb", "idk", "abbreviation"],
  "70": ["slang", "internet slang"],
  "71": ["all caps", "full stop", "period in text"],
  "72": ["one word reply", "said k", "said fine", "said okay"],
  "73": ["hashtag", "trend"],
  "74": ["typing indicator", "seen indicator", "online indicator"],
  "75": ["digital language"],
  "76": ["visibility", "being watched"],
  "77": ["permanence", "nothing is deleted"],
  "78": ["interpretation", "everything means something"],
  "79": ["effort", "low effort reply"],
  "80": ["availability", "always online"],
  "81": ["social hierarchy", "follower count"],
  "82": ["identity construction", "different on each platform"],
  "83": ["indirect communication"],
  "84": ["audience", "context collapse"],
  "85": ["power and control", "who has power"],
};

const signalBoosts: Array<{ ids: string[]; words: string[] }> = [
  { ids: ["16", "50", "63"], words: ["reply", "replied", "replying", "hours", "hour", "mins", "minutes", "late", "delay", "waiting"] },
  { ids: ["18"], words: ["seen", "read", "opened", "blue ticks"] },
  { ids: ["18", "22", "74", "76", "80"], words: ["notification", "notifications", "preview", "online", "active", "last seen"] },
  { ids: ["17", "27", "85"], words: ["double", "again", "twice", "multiple"] },
  { ids: ["20", "64", "72"], words: ["ok", "k", "fine", "hmm", "cool", "dry"] },
  { ids: ["23"], words: ["voice", "audio"] },
  { ids: ["24", "42", "66"], words: ["emoji", "thumbs", "react"] },
  { ids: ["30", "31", "34"], words: ["story", "stories", "close friends", "highlight"] },
  { ids: ["32", "82"], words: ["archive", "delete", "deleted"] },
  { ids: ["48", "62", "77"], words: ["screenshot", "screenshotted"] },
  { ids: ["41", "49"], words: ["group", "left group", "removed from group", "admin"] },
  { ids: ["59", "60", "61"], words: ["unfollow", "removed follower", "block", "blocked"] },
  { ids: ["56", "65", "83"], words: ["indirect", "vague", "lyrics", "caption", "posted about"] },
];

const quickPrompts = [
  "Was Digi-Code violated?",
  "Who has more power?",
  "What should I do?",
  "What does this mean?",
  "Is this a red flag?",
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreRule(ruleId: string, input: string, normalizedInput: string) {
  let score = 0;
  const matchedSignals: string[] = [];
  const keywords = keywordMap[ruleId] ?? [];

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalizedInput.includes(normalizedKeyword)) {
      score += Math.max(6, normalizedKeyword.split(" ").length * 4);
      matchedSignals.push(keyword);
    }
  }

  const rule = rules.find((item) => item.id === ruleId);
  if (!rule) return { score, matchedSignals };

  const searchableParts = [
    rule.title,
    rule.articleTitle,
    rule.clause,
    rule.interpretation,
    ...rule.clauses,
    rule.category,
    ...rule.tags,
  ].map(normalizeText);

  const inputTokens = Array.from(new Set(normalizedInput.split(" ").filter((token) => token.length > 2)));

  for (const token of inputTokens) {
    if (searchableParts.some((part) => part.includes(token))) {
      score += 1;
    }
  }

  for (const boost of signalBoosts) {
    if (!boost.ids.includes(ruleId)) continue;
    for (const word of boost.words) {
      const normalizedWord = normalizeText(word);
      if (normalizedInput.includes(normalizedWord)) {
        score += 3;
        matchedSignals.push(word);
      }
    }
  }

  if (normalizedInput.includes("friend") && ["16", "18", "22", "28", "31"].includes(ruleId)) {
    score += 2;
  }

  if (/\b\d+\s*(hr|hrs|hour|hours|min|mins|minute|minutes)\b/i.test(input) && ["16", "18", "22"].includes(ruleId)) {
    score += 5;
    matchedSignals.push("time delay");
  }

  return {
    score,
    matchedSignals: Array.from(new Set(matchedSignals)),
  };
}

function summarizeSituation(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function getViolationStatus(primaryRule: DigiCodeRule, secondaryRules: DigiCodeRule[]) {
  const relatedArticles = [primaryRule, ...secondaryRules];
  const averageViolation = relatedArticles.reduce((sum, rule) => sum + rule.violatedScore, 0) / relatedArticles.length;

  if (averageViolation >= 85) {
    return "A probable Digi-Code violation is indicated under the cited articles.";
  }
  if (averageViolation >= 65) {
    return "A minor or context-dependent Digi-Code violation may be applicable.";
  }
  return "No severe Digi-Code violation is conclusively established, though the interaction remains socially significant.";
}

function getSocialMeaning(primaryRule: DigiCodeRule, matchedSignals: string[], input: string) {
  const normalizedInput = normalizeText(input);

  if (["18", "22", "16", "50", "63", "80", "85"].includes(primaryRule.id)) {
    return "The behaviour described suggests reduced conversational priority, possible intentional delay, or an attempt to control availability and conversational pace.";
  }
  if (["28", "29", "30", "31", "34", "36"].includes(primaryRule.id)) {
    return "The behaviour indicates shifting social acknowledgment, hierarchy, or selective visibility within the digital relationship.";
  }
  if (["59", "60", "61", "64", "65"].includes(primaryRule.id)) {
    return "The behaviour suggests conflict signalling, emotional distancing, or indirect confrontation rather than neutral digital conduct.";
  }
  if (["32", "52", "53", "55", "82"].includes(primaryRule.id)) {
    return "The behaviour appears connected to identity curation, relationship repositioning, or public image management in digital space.";
  }
  if (matchedSignals.includes("screenshot") || normalizedInput.includes("screenshot")) {
    return "The behaviour indicates heightened surveillance logic, where communication is being treated as evidence rather than as private exchange.";
  }

  return "The behaviour likely reflects a social signal rather than a purely technical action. Under Digi-Code logic, tone, timing, and visibility all carry interpretive meaning.";
}

function getRecommendedAction(primaryRule: DigiCodeRule, input: string) {
  const normalizedInput = normalizeText(input);

  if (["16", "18", "22", "50", "63"].includes(primaryRule.id)) {
    return "Do not escalate immediately through repeated messages. Maintain reply-time balance, observe whether the behaviour repeats, and respond with proportional rather than urgent energy.";
  }
  if (["17", "27", "85"].includes(primaryRule.id)) {
    return "Do not surrender conversational power through excessive follow-up. Allow the interaction to breathe, then reassess whether reciprocity is being maintained.";
  }
  if (["28", "29", "30", "31", "34"].includes(primaryRule.id)) {
    return "Do not confront the matter impulsively. First evaluate whether the change is isolated or part of a broader shift in social acknowledgment, visibility, or hierarchy.";
  }
  if (["59", "60", "61", "64", "65"].includes(primaryRule.id)) {
    return "Proceed with caution. Do not react through indirect escalation. If clarification is necessary, use direct and measured communication rather than symbolic retaliation.";
  }
  if (normalizedInput.includes("birthday")) {
    return "Treat the situation as a test of public acknowledgment norms. Note the effort level before deciding whether the issue reflects forgetfulness or relationship downgrade.";
  }

  return "Take no dramatic action yet. Gather one more behavioural signal, avoid over-interpretation from a single event, and respond with measured digital dignity.";
}

function buildVerdict(primaryRule: DigiCodeRule, violationStatus: string) {
  if (violationStatus.includes("probable")) {
    return `Under Article ${primaryRule.article} - ${primaryRule.title}, the conduct described appears constitutionally questionable and socially consequential.`;
  }
  if (violationStatus.includes("minor")) {
    return `Under Article ${primaryRule.article} - ${primaryRule.title}, the conduct described suggests a mild but meaningful disturbance of Digi-Code expectations.`;
  }
  return `Under Article ${primaryRule.article} - ${primaryRule.title}, no major Digi-Code breach is conclusively established, but the social signal remains noteworthy.`;
}

function formatArticles(primaryRule: DigiCodeRule, secondaryRules: DigiCodeRule[]) {
  return [primaryRule, ...secondaryRules]
    .map((rule) => `- Article ${rule.article} - ${rule.title}`)
    .join("\n");
}

function analyzeInput(input: string): ChatMessage {
  const normalizedInput = normalizeText(input);
  const rankedRules = rules
    .map((rule) => {
      const result = scoreRule(rule.id, input, normalizedInput);
      return {
        rule,
        score: result.score,
        matchedSignals: result.matchedSignals,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary = rankedRules[0];
  const secondary = rankedRules.slice(1, 4);

  if (!primary || primary.score < 5) {
    return {
      role: "bot",
      content: [
        "Case Analysis Report",
        "Situation Summary:",
        summarizeSituation(input),
        "Relevant Digi-Code Articles:",
        "- No dominant article could be conclusively identified from the present facts.",
        "Digi-Code Interpretation:",
        "The matter remains constitutionally ambiguous. More specific details about reply time, seen status, online visibility, posting behaviour, screenshots, blocking, or story interaction are required.",
        "Violation Status:",
        "No formal Digi-Code finding can yet be issued.",
        "Social Meaning:",
        "The described behaviour may still be socially significant, but the available facts are too general for constitutional classification.",
        "Recommended Action:",
        "Submit a fuller factual account with platform indicators, timing, and relationship context.",
        "Digi-Consultant Verdict:",
        "The Court of Digi-Code reserves judgment pending stronger evidence.",
      ].join("\n"),
    };
  }

  const primaryRule = primary.rule;
  const secondaryRules = secondary.map((entry) => entry.rule);
  const violationStatus = getViolationStatus(primaryRule, secondaryRules);
  const interpretation = `${primaryRule.interpretation} ${secondaryRules.length > 0 ? `Related constitutional signals also arise under ${secondaryRules.map((rule) => `Article ${rule.article}`).join(", ")}.` : ""}`.trim();
  const socialMeaning = getSocialMeaning(primaryRule, primary.matchedSignals, input);
  const recommendedAction = getRecommendedAction(primaryRule, input);
  const verdict = buildVerdict(primaryRule, violationStatus);

  return {
    role: "bot",
    content: [
      "Case Analysis Report",
      "Situation Summary:",
      summarizeSituation(input),
      "Relevant Digi-Code Articles:",
      formatArticles(primaryRule, secondaryRules),
      "Digi-Code Interpretation:",
      interpretation,
      "Violation Status:",
      violationStatus,
      "Social Meaning:",
      socialMeaning,
      "Recommended Action:",
      recommendedAction,
      "Digi-Consultant Verdict:",
      verdict,
    ].join("\n"),
  };
}

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const botMsg = analyzeInput(input.trim());

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const applyPrompt = (prompt: string) => {
    const nextValue = input.trim() ? `${input.trim()} ${prompt}` : prompt;
    setInput(nextValue);
  };

  return (
    <section id="chatbot" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-xs font-mono uppercase tracking-[0.4em] text-primary">Digi-Consultant</h2>
          <p className="flex items-center gap-3 text-2xl font-serif text-foreground md:text-3xl">
            <Scale size={28} className="text-primary" />
            Constitutional Review
          </p>
          <p className="mt-2 text-sm font-body text-muted-foreground">
            Submit a digital situation for constitutional interpretation, social analysis, and Digi-Code judgment.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="h-80 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm font-body text-muted-foreground">
                <div className="space-y-3 text-center">
                  <Scale size={24} className="mx-auto opacity-30" />
                  <p>Present the facts of the digital matter before Digi-Consultant.</p>
                  <p className="text-xs">
                    Try: &quot;My friend saw my message, stayed active, and did not reply for 6 hours while posting stories.&quot;
                  </p>
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={msg.role === "user" ? "text-right" : "text-left"}
                >
                  <div
                    className={`inline-block max-w-[88%] rounded-md px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-secondary font-body text-secondary-foreground"
                        : "border border-border bg-surface-elevated font-body text-foreground"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <div className="space-y-2 text-left">
                        {msg.content.split("\n").map((line, j) => {
                          if (line === "Case Analysis Report") {
                            return (
                              <p key={j} className="font-serif text-base text-primary">
                                {line}
                              </p>
                            );
                          }

                          if (line.endsWith(":")) {
                            return (
                              <p key={j} className="pt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-primary/85">
                                {line}
                              </p>
                            );
                          }

                          if (line.startsWith("- ")) {
                            return (
                              <p key={j} className="pl-2 text-secondary-foreground">
                                {line}
                              </p>
                            );
                          }

                          return line.trim() ? <p key={j}>{line}</p> : null;
                        })}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border px-3 pt-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => applyPrompt(prompt)}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-secondary-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 pb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the digital situation for Digi-Consultant..."
                className="flex-1 border-none bg-transparent text-sm font-body text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="p-2 text-primary transition-colors hover:text-gold-glow">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatBot;
