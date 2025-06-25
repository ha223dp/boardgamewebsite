export interface Game {
  id: string;
  name: string;
  description: string;
  players: string;
  playTime: string;
  difficulty: number; // 1-5 scale
  learningCurve: number; // 1-5 scale
  category: string[];
  image: string;
  youtubeUrl: string;
  manualUrl: string;
  rating: number;
  
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  gameLink?: string;
}