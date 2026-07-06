export interface Project {
  id: string;
  title: string;
  genre: string;
  concept: string;
  summary: string;
  wordCount: number;
  lastEdited: string;
  coverColor: string;
  coverIcon: string;
  targetWords: number;
}

export interface Scene {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  content: string;
  wordCount: number;
  lastEdited: string;
  order: number;
  status: "draft" | "review" | "completed";
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  order: number;
  scenes: Scene[];
}

export type LoreType = "character" | "location" | "item" | "faction";

export interface CharacterLore {
  id: string;
  name: string;
  avatar: string; // Avatar seed or CSS gradient config
  role: string; // Protagonist, Antagonist, Supporting, Mentor, etc.
  factionId?: string; // Connected faction
  description: string; // Brief
  traits: string[]; // Strong, Silent, Genius, etc.
  backstory: string; // Detail markdown
  skills: string[];
  relationships: { targetId: string; label: string; type: "ally" | "enemy" | "love" | "neutral" }[];
}

export interface LocationLore {
  id: string;
  name: string;
  image: string; // Card graphic config
  type: string; // City, Dungeon, Realm, Planet, etc.
  description: string;
  history: string; // Detail markdown
  climate: string;
  factions: string[]; // Faction IDs present
}

export interface ItemLore {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  type: string; // Artifact, Magic, Weapon, Tech, etc.
  description: string;
  powers: string[];
  origin: string; // Detail markdown
}

export interface FactionLore {
  id: string;
  name: string;
  bannerColor: string;
  motto: string;
  description: string;
  history: string; // Detail markdown
  members: string[]; // Character IDs
  headquarters: string; // Location ID
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timeLabel: string; // e.g. "Year 2045", "Day 1 of Revolt"
  associatedLoreIds: string[]; // Linked characters, locations
  chapterId?: string; // Linked chapter/scene
  importance: "high" | "medium" | "low";
  arcId: string; // Which story arc it belongs to
}

export interface StoryArc {
  id: string;
  name: string;
  color: string;
}
