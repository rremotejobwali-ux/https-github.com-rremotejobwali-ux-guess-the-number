export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
}

export type GuessResult = 'low' | 'high' | 'correct';

export interface GuessRecord {
  number: number;
  result: GuessResult;
  id: string;
}

export interface AIResponse {
  text: string;
  mood: 'sassy' | 'encouraging' | 'celebratory' | 'neutral';
}
