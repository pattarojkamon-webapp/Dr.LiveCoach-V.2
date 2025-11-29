
export enum Role {
  COACH = 'Coach',
  COACHEE = 'Coachee',
}

export enum CoachingModel {
  GROW = 'GROW Model',
  OSKAR = 'OSKAR Model',
  CLEAR = 'CLEAR Model',
  FREE_FLOW = 'Free Flow / General',
}

export interface Persona {
  gender: string;
  age: string;
  profession: string;
  position: string;
  topic: string;
}

export type Language = 'EN' | 'TH' | 'CN';

export type InteractionType = 'TEXT' | 'VOICE';

export interface Theme {
  id: string;
  name: string;
  primary: string;    // Header, Dark bg
  secondary: string;  // Buttons, Accents
  accent: string;     // Light accent
  background: string; // Main app bg
  gradient: string;   // New: for sophisticated backgrounds
}

export interface AppConfig {
  userRole: Role;
  persona: Persona;
  model: CoachingModel;
  language: Language;
  interactionType: InteractionType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface EvaluationMetric {
  category: string;
  score: number; // 0-10
  fullMark: number;
}

export interface EvaluationResult {
  metrics: EvaluationMetric[];
  strengths: string[];
  improvements: string[];
  recommendedActions: string[];
  summary: string;
}

export interface User {
  id: string;
  username: string; // Unique identifier for login
  name: string;     // Display Name
  password?: string; // In real app, this would be hashed
  createdAt: number;
}

export interface SessionRecord {
  id: string;
  userId: string; // Linked to specific user
  timestamp: number;
  durationSeconds: number;
  config: AppConfig;
  messages: ChatMessage[];
  evaluation: EvaluationResult;
}

export type AppState = 'CONFIG' | 'CHAT' | 'LIVE_SESSION' | 'EVALUATION' | 'LOADING_EVALUATION' | 'HISTORY';