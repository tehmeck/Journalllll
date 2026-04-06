export interface TimestampBlock {
  id: string;
  time: string; // HH:MM AM/PM
  text: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO Date string for sorting
  title: string;
  formattedDate: string; // "Tuesday, December 23rd, 2025"
  blocks: TimestampBlock[];
  tags: string[];
  isStarred: boolean;
  type: 'daily' | 'note';
  color?: string;
  isArchived?: boolean;
  isDeleted?: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
  isCleared?: boolean;
}

export interface UserStats {
  wordsTyped: number;
  pagesWritten: number;
  tasksAccomplished: number;
  searchesMade: number;
  streakDays: number;
  uniqueWords: number;
}

export enum AppView {
  TODAY = 'today',
  PAGES = 'pages',
  EVERYTHING = 'everything',
  STARRED = 'starred',
  TAGS = 'tags',
  INSIGHTS = 'insights',
  REFLECTIONS = 'reflections',
  ARCHIVE = 'archive',
  COMPLETED = 'completed',
  DELETED = 'deleted',
  STATS = 'stats'
}

export interface GeminiInsight {
  type: 'question' | 'musing' | 'idea';
  content: string;
}