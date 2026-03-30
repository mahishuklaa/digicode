import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Scale } from "lucide-react";
import { rules } from "@/data/digicode-rules";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

function analyzeInput(input: string): ChatMessage {
  const lower = input.toLowerCase();
  
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

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [ruleId, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword) && keyword.length > bestScore) {
        bestMatch = ruleId;
        bestScore = keyword.length;
      }
    }
  }

  if (bestMatch) {
    const rule = rules.find(r => r.id === bestMatch);
    if (rule) {
      const riskLevels = ["Low", "Moderate", "High", "Critical"];
      const risk = riskLevels[Math.min(Math.floor(rule.violatedScore / 25), 3)];
      return {
        role: "bot",
        content: `🚨 **CODE BROKEN**\n\n**Reference:** Article ${rule.article} · Section ${rule.section} — *${rule.title}*\n\n**The Rule:** "${rule.clause}"\n\n**Risk Level:** ${risk}\n\n**Verdict:** ${rule.interpretation} You've been caught. The Code sees everything.`,
      };
    }
  }

  return {
    role: "bot",
    content: `✅ **NO VIOLATION DETECTED**\n\nThe Code has reviewed your submission and finds no applicable rule governing this behaviour. You're still within acceptable limits of the code. For now.\n\n*But just because it's not written doesn't mean people won't judge you for it.*`,
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

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <section id="chatbot" className="py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">Interactive Check</h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground flex items-center gap-3">
            <Scale size={28} className="text-primary" />
            Check the Code
          </p>
          <p className="text-sm text-muted-foreground mt-2 font-body">
            Describe a digital interaction. We'll tell you if you broke the code.
          </p>
        </motion.div>

        <div className="border border-border rounded-md bg-card overflow-hidden">
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-body">
                <div className="text-center space-y-2">
                  <Scale size={24} className="mx-auto opacity-30" />
                  <p>Go ahead. Tell us what you did.</p>
                  <p className="text-xs">Try: "I double texted at 2am and they didn't reply"</p>
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <div className={`inline-block max-w-[85%] px-4 py-3 rounded-md text-sm ${
                    msg.role === "user"
                      ? "bg-secondary text-secondary-foreground font-body"
                      : "bg-surface-elevated text-foreground font-body border border-border"
                  }`}>
                    {msg.role === "bot" ? (
                      <div className="space-y-2 text-left">
                        {msg.content.split("\n").map((line, j) => {
                          if (line.startsWith("🚨") || line.startsWith("✅")) {
                            return <p key={j} className="font-serif font-bold text-base">{line}</p>;
                          }
                          const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
                          if (boldMatch) {
                            return <p key={j}><strong className="text-primary font-mono text-xs tracking-wider uppercase">{boldMatch[1]}</strong> {boldMatch[2]}</p>;
                          }
                          if (line.startsWith("*") && line.endsWith("*")) {
                            return <p key={j} className="text-muted-foreground italic text-xs mt-1">{line.replace(/\*/g, "")}</p>;
                          }
                          if (line.trim()) return <p key={j}>{line.replace(/\*/g, "")}</p>;
                          return null;
                        })}
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe what happened..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-body text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="p-2 text-primary hover:text-gold-glow transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatBot;
