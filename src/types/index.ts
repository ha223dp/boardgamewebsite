export interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: number; // in minutes
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Hard
  complexity: 1 | 2 | 3 | 4 | 5; // 1 = Simple, 5 = Complex
  imageUrl: string;
  videoUrl?: string;
  manualUrl?: string;
  category: GameCategory[];
  isFeatured?: boolean;
  funFact?: string;
  releaseYear?: number;
  designer?: string;
  publisher?: string;
  awards?: string[];
}

export type GameCategory = 
  | 'strategy'
  | 'family'
  | 'party'
  | 'card'
  | 'cooperative'
  | 'competitive'
  | 'rpg'
  | 'dice'
  | 'adventure'
  | 'card game'
  | 'action'
  | 'social media'
  | 'humor'
  | 'mystery';
  | 'classic';
  | 'deduction';
  | 'drawing';
  | 'dice Rolling';
  | 'betrayal';
  | 'horror';
  | 'exploration';
  | 'dungeon Crawler';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface FilterOptions {
  players?: number;
  maxTime?: number;
  difficulty?: number;
  complexity?: number;
  categories?: GameCategory[];
}