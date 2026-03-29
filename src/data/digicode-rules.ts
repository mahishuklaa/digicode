export type DigiCodeCategory = "Messaging" | "Social Media" | "Group Chats" | "Identity" | "Power";
export type DigiCodeTag = "Power" | "Surveillance" | "Identity" | "Sociality" | "Normalisation";

export interface DigiCodeRule {
  id: string;
  article: number;
  articleTitle: string;
  section: string;
  title: string;
  clause: string;
  interpretation: string;
  category: DigiCodeCategory;
  tags: DigiCodeTag[];
}

export const rules: DigiCodeRule[] = [
  // ARTICLE I: Messaging Conduct
  { id: "1.1", article: 1, articleTitle: "Messaging Conduct", section: "1.1", title: "Instant Reply Regulation", clause: "Immediate responses may signal excessive availability and reduce perceived social value.", interpretation: "Response timing is used to construct identity and desirability.", category: "Messaging", tags: ["Power", "Identity"] },
  { id: "1.2", article: 1, articleTitle: "Messaging Conduct", section: "1.2", title: "Seen Without Reply", clause: "Viewing a message without responding establishes asymmetrical power.", interpretation: "Visibility enables silent dominance.", category: "Messaging", tags: ["Power", "Surveillance"] },
  { id: "1.3", article: 1, articleTitle: "Messaging Conduct", section: "1.3", title: "Double Texting", clause: "Sending consecutive messages without reply may reduce perceived status.", interpretation: "Persistence is interpreted as imbalance in interest.", category: "Messaging", tags: ["Power", "Sociality"] },
  { id: "1.4", article: 1, articleTitle: "Messaging Conduct", section: "1.4", title: "Typing Indicator Anxiety", clause: "Initiating and withdrawing typed messages creates perceived hesitation.", interpretation: "Micro-actions influence emotional interpretation.", category: "Messaging", tags: ["Surveillance", "Sociality"] },
  { id: "1.5", article: 1, articleTitle: "Messaging Conduct", section: "1.5", title: "Late Night Messaging", clause: "Messages sent at late hours may signal intimacy or urgency.", interpretation: "Timing affects perceived relational closeness.", category: "Messaging", tags: ["Sociality", "Identity"] },
  { id: "1.6", article: 1, articleTitle: "Messaging Conduct", section: "1.6", title: "Voice Note Protocol", clause: "Sending unsolicited voice messages may constitute a breach of communicative etiquette.", interpretation: "Format choice signals relational assumptions.", category: "Messaging", tags: ["Sociality", "Normalisation"] },
  { id: "1.7", article: 1, articleTitle: "Messaging Conduct", section: "1.7", title: "Emoji Substitution", clause: "Replacing textual expression with emoji alters interpretive depth.", interpretation: "Symbolic compression reshapes meaning.", category: "Messaging", tags: ["Identity", "Normalisation"] },
  { id: "1.8", article: 1, articleTitle: "Messaging Conduct", section: "1.8", title: "Read Receipt Manipulation", clause: "Disabling read receipts constitutes strategic information asymmetry.", interpretation: "Controlling visibility is controlling power.", category: "Messaging", tags: ["Power", "Surveillance"] },
  { id: "1.9", article: 1, articleTitle: "Messaging Conduct", section: "1.9", title: "Reaction-Only Response", clause: "Responding with a reaction rather than text terminates conversation by design.", interpretation: "Minimal engagement signals conversational closure.", category: "Messaging", tags: ["Power", "Sociality"] },
  { id: "1.10", article: 1, articleTitle: "Messaging Conduct", section: "1.10", title: "Screenshot Doctrine", clause: "Capturing private messages for external distribution violates communicative trust.", interpretation: "Context collapse weaponises private discourse.", category: "Messaging", tags: ["Surveillance", "Power"] },

  // ARTICLE II: Social Media Behaviour
  { id: "2.1", article: 2, articleTitle: "Social Media Behaviour", section: "2.1", title: "Story Priority", clause: "Story viewers are assigned greater interpretive value than passive engagement.", interpretation: "Visibility hierarchy determines importance.", category: "Social Media", tags: ["Surveillance", "Power"] },
  { id: "2.2", article: 2, articleTitle: "Social Media Behaviour", section: "2.2", title: "Close Friends List", clause: "Restricted story sharing enables selective identity performance.", interpretation: "Identity is segmented across audiences.", category: "Social Media", tags: ["Identity", "Sociality"] },
  { id: "2.3", article: 2, articleTitle: "Social Media Behaviour", section: "2.3", title: "Posting Frequency", clause: "Excessive posting may reduce perceived value of content.", interpretation: "Scarcity increases perceived relevance.", category: "Social Media", tags: ["Normalisation", "Identity"] },
  { id: "2.4", article: 2, articleTitle: "Social Media Behaviour", section: "2.4", title: "Archive and Delete", clause: "Removal of posts allows retroactive identity editing.", interpretation: "Digital identity is continuously curated.", category: "Social Media", tags: ["Identity", "Power"] },
  { id: "2.5", article: 2, articleTitle: "Social Media Behaviour", section: "2.5", title: "Like Removal", clause: "Withdrawal of engagement may signal disapproval or distancing.", interpretation: "Interaction becomes communicative.", category: "Social Media", tags: ["Sociality", "Power"] },
  { id: "2.6", article: 2, articleTitle: "Social Media Behaviour", section: "2.6", title: "Follower-to-Following Ratio", clause: "Maintaining a favourable ratio signals perceived social capital.", interpretation: "Numbers encode hierarchical status.", category: "Social Media", tags: ["Power", "Identity"] },
  { id: "2.7", article: 2, articleTitle: "Social Media Behaviour", section: "2.7", title: "Comment Section Conduct", clause: "Public commentary constitutes performative social engagement.", interpretation: "Comments serve audiences beyond the recipient.", category: "Social Media", tags: ["Sociality", "Normalisation"] },
  { id: "2.8", article: 2, articleTitle: "Social Media Behaviour", section: "2.8", title: "Soft Launch Protocol", clause: "Gradual revelation of personal information constitutes strategic disclosure.", interpretation: "Mystery is a social currency.", category: "Social Media", tags: ["Identity", "Power"] },
  { id: "2.9", article: 2, articleTitle: "Social Media Behaviour", section: "2.9", title: "Highlight Curation", clause: "Permanent story highlights function as curated identity museums.", interpretation: "Archived moments define the public self.", category: "Social Media", tags: ["Identity", "Normalisation"] },
  { id: "2.10", article: 2, articleTitle: "Social Media Behaviour", section: "2.10", title: "Unfollow Surveillance", clause: "Monitoring follower changes constitutes relational surveillance.", interpretation: "Loss tracking reveals attachment dynamics.", category: "Social Media", tags: ["Surveillance", "Sociality"] },

  // ARTICLE III: Group Chat Dynamics
  { id: "3.1", article: 3, articleTitle: "Group Chat Dynamics", section: "3.1", title: "Passive Participation", clause: "Presence without contribution constitutes implicit participation.", interpretation: "Silence still holds meaning.", category: "Group Chats", tags: ["Sociality", "Normalisation"] },
  { id: "3.2", article: 3, articleTitle: "Group Chat Dynamics", section: "3.2", title: "Meme Circulation", clause: "Memes function as units of social bonding.", interpretation: "Humor maintains group cohesion.", category: "Group Chats", tags: ["Sociality", "Normalisation"] },
  { id: "3.3", article: 3, articleTitle: "Group Chat Dynamics", section: "3.3", title: "First Response Effect", clause: "Initial replies set tone for subsequent interaction.", interpretation: "Early engagement shapes discourse.", category: "Group Chats", tags: ["Power", "Sociality"] },
  { id: "3.4", article: 3, articleTitle: "Group Chat Dynamics", section: "3.4", title: "Ignoring Messages", clause: "Selective response alters conversational direction.", interpretation: "Attention equals control.", category: "Group Chats", tags: ["Power", "Surveillance"] },
  { id: "3.5", article: 3, articleTitle: "Group Chat Dynamics", section: "3.5", title: "Message Timing", clause: "Timing influences visibility and response likelihood.", interpretation: "Interaction is strategic.", category: "Group Chats", tags: ["Power", "Normalisation"] },
  { id: "3.6", article: 3, articleTitle: "Group Chat Dynamics", section: "3.6", title: "Group Name Protocol", clause: "Renaming a group chat constitutes an assertion of social authority.", interpretation: "Naming is an act of ownership.", category: "Group Chats", tags: ["Power", "Identity"] },
  { id: "3.7", article: 3, articleTitle: "Group Chat Dynamics", section: "3.7", title: "Leaving the Group", clause: "Voluntary departure from a group chat is interpreted as social rupture.", interpretation: "Exit is a statement, not merely an action.", category: "Group Chats", tags: ["Sociality", "Power"] },
  { id: "3.8", article: 3, articleTitle: "Group Chat Dynamics", section: "3.8", title: "Pinned Message Authority", clause: "Pinning a message elevates its status above all other discourse.", interpretation: "Curation within groups mirrors editorial power.", category: "Group Chats", tags: ["Power", "Normalisation"] },

  // ARTICLE IV: Identity & Behaviour
  { id: "4.1", article: 4, articleTitle: "Identity & Behaviour", section: "4.1", title: "Curated Self", clause: "Digital identity shall be selectively constructed.", interpretation: "Authenticity is secondary to perception.", category: "Identity", tags: ["Identity", "Normalisation"] },
  { id: "4.2", article: 4, articleTitle: "Identity & Behaviour", section: "4.2", title: "Online Silence", clause: "Absence of activity is interpreted socially.", interpretation: "Silence is meaningful, not neutral.", category: "Identity", tags: ["Identity", "Surveillance"] },
  { id: "4.3", article: 4, articleTitle: "Identity & Behaviour", section: "4.3", title: "Activity Patterns", clause: "Frequency of interaction contributes to identity perception.", interpretation: "Behaviour defines personality.", category: "Identity", tags: ["Identity", "Normalisation"] },
  { id: "4.4", article: 4, articleTitle: "Identity & Behaviour", section: "4.4", title: "Selective Engagement", clause: "Users interact strategically based on audience.", interpretation: "Social context shapes behaviour.", category: "Identity", tags: ["Identity", "Sociality"] },
  { id: "4.5", article: 4, articleTitle: "Identity & Behaviour", section: "4.5", title: "Profile Aesthetics", clause: "Visual presentation influences credibility and desirability.", interpretation: "Identity is visually encoded.", category: "Identity", tags: ["Identity", "Normalisation"] },
  { id: "4.6", article: 4, articleTitle: "Identity & Behaviour", section: "4.6", title: "Bio as Manifesto", clause: "Profile biographies function as compressed identity statements.", interpretation: "Every word is weighted with intent.", category: "Identity", tags: ["Identity", "Power"] },
  { id: "4.7", article: 4, articleTitle: "Identity & Behaviour", section: "4.7", title: "Username Semiotics", clause: "Handle selection encodes aspirational or ironic identity.", interpretation: "Names are not neutral — they are performed.", category: "Identity", tags: ["Identity", "Normalisation"] },
  { id: "4.8", article: 4, articleTitle: "Identity & Behaviour", section: "4.8", title: "Platform Migration", clause: "Transitioning between platforms signals evolving identity alignment.", interpretation: "Where you exist digitally defines who you are.", category: "Identity", tags: ["Identity", "Sociality"] },

  // ARTICLE V: Power & Digital Hierarchies
  { id: "5.1", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.1", title: "Reply Delay Power", clause: "Delayed responses may increase perceived control.", interpretation: "Time becomes a tool of dominance.", category: "Power", tags: ["Power", "Surveillance"] },
  { id: "5.2", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.2", title: "Ignoring as Strategy", clause: "Non-response may function as assertion of superiority.", interpretation: "Absence creates hierarchy.", category: "Power", tags: ["Power", "Sociality"] },
  { id: "5.3", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.3", title: "Visibility Control", clause: "Managing online presence affects perceived importance.", interpretation: "Scarcity signals value.", category: "Power", tags: ["Power", "Identity"] },
  { id: "5.4", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.4", title: "Engagement Distribution", clause: "Selective interaction determines relational hierarchy.", interpretation: "Attention is currency.", category: "Power", tags: ["Power", "Sociality"] },
  { id: "5.5", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.5", title: "Algorithmic Amplification", clause: "Platform visibility affects perceived influence.", interpretation: "Power is shaped by platform systems.", category: "Power", tags: ["Power", "Surveillance"] },
  { id: "5.6", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.6", title: "Verification Privilege", clause: "Platform-verified status confers institutional legitimacy.", interpretation: "A blue checkmark is a digital title of nobility.", category: "Power", tags: ["Power", "Identity"] },
  { id: "5.7", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.7", title: "Viral Jurisprudence", clause: "Content that achieves virality temporarily elevates its creator above established hierarchies.", interpretation: "Virality is an unpredictable redistribution of power.", category: "Power", tags: ["Power", "Normalisation"] },
  { id: "5.8", article: 5, articleTitle: "Power & Digital Hierarchies", section: "5.8", title: "Cancel Protocol", clause: "Collective withdrawal of engagement constitutes a digital tribunal.", interpretation: "Public judgment replaces institutional accountability.", category: "Power", tags: ["Power", "Sociality", "Surveillance"] },
];

export const categories: DigiCodeCategory[] = ["Messaging", "Social Media", "Group Chats", "Identity", "Power"];
export const tags: DigiCodeTag[] = ["Power", "Surveillance", "Identity", "Sociality", "Normalisation"];

export const recentCases = [
  { id: "021", title: "Double Texting Incident", section: "Article I, Section 1.3", result: "Violation Confirmed" as const, summary: "Subject sent four consecutive messages over 47 minutes without acknowledgment. The tribunal finds this constitutes a clear breach of Section 1.3, resulting in measurable reduction of perceived social standing." },
  { id: "034", title: "Late Reply Strategy", section: "Article V, Section 5.1", result: "No Violation" as const, summary: "Subject delayed response by 3 hours to a non-urgent inquiry. The tribunal finds this falls within acceptable bounds of Reply Delay Power as codified in Section 5.1." },
  { id: "042", title: "Story Viewer Surveillance", section: "Article II, Section 2.1", result: "Violation Confirmed" as const, summary: "Subject viewed a story 37 times within 24 hours. Repeated surveillance of story metrics constitutes obsessive engagement tracking." },
  { id: "055", title: "Group Chat Exit Without Notice", section: "Article III, Section 3.7", result: "Violation Confirmed" as const, summary: "Subject departed group chat during active discussion without explanation. The act constituted social rupture per Section 3.7." },
  { id: "061", title: "Strategic Archive of Posts", section: "Article II, Section 2.4", result: "No Violation" as const, summary: "Subject archived posts older than 6 months as part of identity refinement. Retroactive identity editing is a protected right under Section 2.4." },
];
