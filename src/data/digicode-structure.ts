export interface DigiCodeDefinition {
  id: number;
  term: string;
  text: string;
}

export interface DigiCodePartSection {
  id: string;
  label: string;
  title: string;
  intro: string[];
}

export interface DigiCodeTable {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface DigiCodePartWithArticles extends DigiCodePartSection {
  articleNumbers: number[];
}

export interface DigiCodeChapter {
  id: string;
  label: string;
  title: string;
  articleNumbers: number[];
}

export interface DigiCodePartWithChapters extends DigiCodePartSection {
  chapters: DigiCodeChapter[];
}

export const definitions: DigiCodeDefinition[] = [
  {
    id: 1,
    term: "Digital Citizen",
    text: "A Digital Citizen shall refer to any individual who participates in digital communication, social media platforms, online communities, or messaging environments.",
  },
  {
    id: 2,
    term: "Digital Communication",
    text: "Digital Communication shall include text messages, voice notes, images, videos, emojis, memes, reactions, status updates, posts, comments, and platform indicators.",
  },
  {
    id: 3,
    term: "Platform Indicators",
    text: "Platform Indicators shall include features such as \"Seen\", \"Typing...\", \"Online\", \"Last Seen\", Story Views, Likes, and Read Receipts that communicate information without words.",
  },
  {
    id: 4,
    term: "Social Acknowledgment",
    text: "Social Acknowledgment shall include liking, reacting, commenting, replying, tagging, or any visible interaction that indicates recognition of another individual's digital activity.",
  },
  {
    id: 5,
    term: "Digital Relationship",
    text: "Digital Relationship shall refer to any friendship, romantic relationship, acquaintance, or social connection that is maintained or expressed through digital platforms.",
  },
  {
    id: 6,
    term: "Indirect Communication",
    text: "Indirect Communication shall refer to communication through posts, stories, captions, songs, memes, status updates, or other content intended for a specific individual but visible to a wider audience.",
  },
  {
    id: 7,
    term: "Digital Conflict",
    text: "Digital Conflict shall refer to disagreement, distancing, or tension expressed through digital behaviour such as delayed replies, dry replies, unfollowing, blocking, indirect posts, or removal of digital interaction.",
  },
];

export const partRights: DigiCodePartWithArticles = {
  id: "part-1",
  label: "Part I",
  title: "Fundamental Rights of Digital Citizens",
  intro: [
    "Fundamental Rights refer to the basic expectations every digital citizen has while participating in digital communication and social media environments.",
  ],
  articleNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
};

export const partDuties: DigiCodePartWithArticles = {
  id: "part-2",
  label: "Part II",
  title: "Fundamental Duties of Digital Citizens",
  intro: [
    "Fundamental Duties refer to the expected behaviours individuals must follow in order to maintain relationships and social harmony in digital environments.",
  ],
  articleNumbers: [9, 10, 11, 12, 13, 14, 15],
};

export const partOffences: DigiCodePartSection = {
  id: "part-3",
  label: "Part III",
  title: "Digital Offences and Social Penalties",
  intro: [
    "The following acts shall constitute digital offences under this Constitution. These offences may result in social penalties including but not limited to reduced interaction, emotional distancing, delayed responses, or reputational consequences.",
    "This section shows that digital spaces have informal systems of punishment and social control. When individuals violate digital social norms, there are social consequences like emotional distance, reduced replies, exclusion, or indirect confrontation.",
  ],
};

export const offencesTable: DigiCodeTable = {
  title: "Digital Offence / Social Penalty Index",
  columns: ["Digital Offence", "Social Penalty"],
  rows: [
    ["Leaving on seen", "Reduced reply priority"],
    ["Not liking friend's post", "Emotional distance"],
    ["Dry replies", "Conversation termination"],
    ["Leaving group", "Permanent screenshot circulation"],
    ["Breaking streak", "Loss of best friend status"],
    ["Late reply", "\"It's okay\" (It is not okay) treatment"],
    ["Ignoring reels/memes sent by friend", "Friendship probation"],
    ["Posting and not replying to comments", "Social arrogance label"],
    ["Watching story instantly but replying after 10 hours", "Suspicious behaviour tag"],
    ["Unfollowing", "Social investigation committee formed"],
    ["Removing tags/posts suddenly", "Breakup speculation"],
  ],
};

export const partCode: DigiCodePartWithChapters = {
  id: "part-4",
  label: "Part IV",
  title: "The Digital Code",
  intro: [],
  chapters: [
    {
      id: "chapter-1",
      label: "Chapter 1",
      title: "Messaging Code",
      articleNumbers: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    },
    {
      id: "chapter-2",
      label: "Chapter 2",
      title: "Instagram Code",
      articleNumbers: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    },
    {
      id: "chapter-3",
      label: "Chapter 3",
      title: "Group Chat Code",
      articleNumbers: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    },
    {
      id: "chapter-4",
      label: "Chapter 4",
      title: "Relationship Code",
      articleNumbers: [50, 51, 52, 53, 54, 55, 56, 57, 58],
    },
    {
      id: "chapter-5",
      label: "Chapter 5",
      title: "Conflict Code",
      articleNumbers: [59, 60, 61, 62, 63, 64, 65],
    },
    {
      id: "chapter-6",
      label: "Chapter 6",
      title: "Meme & Internet Language Code",
      articleNumbers: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
    },
  ],
};

export const partPrinciples: DigiCodePartWithArticles = {
  id: "part-5",
  label: "Part V",
  title: "General Principles of Digital Society",
  intro: [
    "These principles form the foundation upon which digital behaviour, communication, and relationships operate within digital environments.",
    "These principles shall apply to all forms of digital interaction across platforms.",
  ],
  articleNumbers: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85],
};

export const schedulesSection: DigiCodePartSection = {
  id: "part-6",
  label: "Part VI",
  title: "Schedules",
  intro: [
    "Schedule I - Reply Time Classification",
    "Schedule II - Digital Relationship Visibility Levels",
    "Schedule III - Digital Conflict Severity Levels",
    "Schedule IV - Effort Levels in Digital Communication",
  ],
};

export const scheduleTables: DigiCodeTable[] = [
  {
    title: "Schedule I - Reply Time Classification",
    columns: ["Reply Time", "Interpretation"],
    rows: [
      ["< 5 min", "High interest"],
      ["5-30 min", "Normal"],
      ["1-3 hours", "Busy"],
      ["6-12 hours", "Low priority"],
      ["24+ hours", "Avoidance"],
      ["Seen + no reply", "Social danger"],
    ],
  },
  {
    title: "Schedule II - Digital Relationship Visibility Levels",
    columns: ["Platform Feature", "Relationship Level"],
    rows: [
      ["Like", "Basic acknowledgment"],
      ["Comment", "Support"],
      ["Story reply", "Conversation interest"],
      ["Close Friends", "Inner circle"],
      ["Tagging", "Public association"],
      ["Feed post", "Public importance"],
      ["Highlight", "Long-term importance"],
    ],
  },
  {
    title: "Schedule III - Digital Conflict Severity Levels",
    columns: ["Action", "Conflict Level"],
    rows: [
      ["Late reply", "Low"],
      ["Dry reply", "Low"],
      ["Seen ignore", "Medium"],
      ["Remove follower", "Medium"],
      ["Unfollow", "High"],
      ["Block", "Extreme"],
    ],
  },
  {
    title: "Schedule IV - Effort Levels in Digital Communication",
    columns: ["Digital Action", "Effort Level"],
    rows: [
      ["Seen", "No effort"],
      ["Like", "Low effort"],
      ["Reaction", "Low effort"],
      ["Short reply", "Low effort"],
      ["Emoji reply", "Low effort"],
      ["Comment", "Medium effort"],
      ["Story reply", "Medium effort"],
      ["Long message", "High effort"],
      ["Voice note", "High effort"],
      ["Video call", "Very high effort"],
    ],
  },
];

export const conclusionSection: DigiCodePartSection = {
  id: "conclusion",
  label: "Conclusion",
  title: "Conclusion",
  intro: [
    "This Constitution does not create these rules but formally documents the unwritten norms that already govern behaviour in digital society.",
    "By documenting these norms, the Digi-Code Constitution attempts to make visible the invisible rules, expectations, power structures, and social behaviours that operate within digital communication environments.",
  ],
};
