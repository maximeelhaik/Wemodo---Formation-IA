export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isFinished: boolean;
  selectedOption: number | null;
  hasValidated: boolean;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  total: number;
  date: string;
  appId: string;
  time?: number;
}

export interface Chapter {
  id: string;
  title: string;
  questions?: Question[];
  isUpdated?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  color: string;
  chapters: Chapter[];
}

