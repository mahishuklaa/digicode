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
    "1.1": ["instant reply", "reply too fast", "replied immediately", "responded instantly", "quick reply", "fast response"],
    "1.2": ["seen", "left on read", "read but", "opened but", "blue ticks"],
    "1.3": ["double text", "texted twice", "sent again", "multiple messages", "texted and they didn't reply"],
    "1.4": ["typing", "started typing", "typing indicator", "typing bubble"],
    "1.5": ["late night", "midnight", "2am", "3am", "late at night", "night message"],
    "1.6": ["voice note", "voice message", "audio message"],
    "1.7": ["emoji", "only sent emoji", "emoji instead"],
    "1.8": ["read receipt", "turned off read", "disabled read"],
    "1.9": ["reaction", "reacted with", "heart react", "thumbs up"],
    "1.10": ["screenshot", "screenshotted", "screen shot"],
    "2.1": ["story", "viewed my story", "story views", "watched my story"],
    "2.2": ["close friends", "private story"],
    "2.3": ["posting too much", "post every day", "posting frequency", "spam post"],
    "2.4": ["archive", "deleted post", "removed post"],
    "2.5": ["unliked", "removed like", "took back like"],
    "2.6": ["followers", "following ratio", "follower count"],
    "2.7": ["comment", "commented"],
    "2.8": ["soft launch", "hinted at", "subtle reveal"],
    "2.9": ["highlight", "story highlight"],
    "2.10": ["unfollowed", "unfollow"],
    "3.1": ["lurk", "just watching", "never talk", "passive", "silent in group"],
    "3.2": ["meme", "sent a meme"],
    "3.3": ["first to reply", "replied first"],
    "3.4": ["ignored", "skipped message", "pretended not to see"],
    "3.5": ["message timing", "sent at wrong time"],
    "3.6": ["renamed the group", "group name", "changed group"],
    "3.7": ["left the group", "left group chat", "exited the group"],
    "3.8": ["pinned message", "pinned"],
    "4.1": ["curated", "fake persona", "online persona"],
    "4.2": ["went silent", "disappeared", "inactive", "offline"],
    "4.3": ["always online", "activity status", "active status"],
    "4.4": ["only reply to", "selective", "pick and choose"],
    "4.5": ["profile picture", "aesthetic", "profile pic", "pfp"],
    "4.6": ["bio", "changed bio"],
    "4.7": ["username", "changed handle", "new username"],
    "4.8": ["switched to", "moved to", "new platform"],
    "5.1": ["delayed reply", "took hours", "waited to reply", "reply delay", "late reply"],
    "5.2": ["ignored on purpose", "strategic ignore"],
    "5.3": ["visibility", "online status", "last seen"],
    "5.4": ["only like certain", "engagement", "selective like"],
    "5.5": ["algorithm", "viral", "reach"],
    "5.6": ["verified", "blue check", "checkmark"],
    "5.7": ["went viral"],
    "5.8": ["cancel", "cancelled"],
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
      return {
        role: "bot",
        content: `⚖️ **VIOLATION DETECTED**\n\n**Reference:** Article ${rule.article}, Section ${rule.section} — *${rule.title}*\n\n**Clause:** "${rule.clause}"\n\n**Ruling:** ${rule.interpretation} This action constitutes a breach of the DigiCode as codified under ${rule.articleTitle}. The tribunal advises reconsideration of digital conduct.`,
      };
    }
  }

  return {
    role: "bot",
    content: `✅ **NO VIOLATION DETECTED**\n\nThe DigiCode tribunal has reviewed your submission and finds no applicable article or section governing this behaviour. However, the absence of codification does not imply the absence of social consequence. Proceed with caution.`,
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
          <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-primary mb-4">Interactive Tribunal</h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground flex items-center gap-3">
            <Scale size={28} className="text-primary" />
            Consult the DigiCode
          </p>
          <p className="text-sm text-muted-foreground mt-2 font-body">
            Describe a digital interaction. The tribunal will determine if a violation has occurred.
          </p>
        </motion.div>

        <div className="border border-border rounded-md bg-card overflow-hidden">
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-body">
                <div className="text-center space-y-2">
                  <Scale size={24} className="mx-auto opacity-30" />
                  <p>The tribunal awaits your case.</p>
                  <p className="text-xs">Try: "I double texted and they didn't reply"</p>
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
                          if (line.startsWith("⚖️") || line.startsWith("✅")) {
                            return <p key={j} className="font-serif font-bold text-base">{line}</p>;
                          }
                          const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
                          if (boldMatch) {
                            return <p key={j}><strong className="text-primary font-mono text-xs tracking-wider uppercase">{boldMatch[1]}</strong> {boldMatch[2]}</p>;
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
              placeholder="Describe a digital situation..."
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
