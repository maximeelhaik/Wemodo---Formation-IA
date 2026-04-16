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
