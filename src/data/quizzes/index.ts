import genAiQuizzes from './gen-ai.json';
import m1Quizzes from './m1.json';
import m2Quizzes from './m2.json';
import { Question } from '../../types';

// Helper to cast JSON data to Question[]
const cast = (data: any) => data as Question[];

// Level-based questions (for the main AI Quiz)
export const GEN_AI_QUESTIONS = cast(genAiQuizzes.level1);
export const GEN_AI_QUESTIONS_L2 = cast(genAiQuizzes.level2);
export const GEN_AI_QUESTIONS_L3 = cast(genAiQuizzes.level3);
export const GEN_AI_QUESTIONS_L4 = cast(genAiQuizzes.level4);

// Module 1 Questions
export const QUIZ_M1C1 = GEN_AI_QUESTIONS; // M1C1 uses the same as Level 1
export const QUIZ_M1C2 = cast(m1Quizzes.c2);
export const QUIZ_M1C3 = cast(m1Quizzes.c3);
export const QUIZ_M1C4 = cast(m1Quizzes.c4);

// Module 2 Questions
export const QUIZ_M2C1 = cast(m2Quizzes.c1);
export const QUIZ_M2C2 = cast(m2Quizzes.c2);
export const QUIZ_M2C3 = cast(m2Quizzes.c3);
export const QUIZ_M2C4 = cast(m2Quizzes.c4);
export const QUIZ_M2C5 = cast(m2Quizzes.c5);
export const QUIZ_M2C6 = cast(m2Quizzes.c6);
export const QUIZ_M2C7 = cast(m2Quizzes.c7);
export const QUIZ_M2C8 = cast(m2Quizzes.c8);

// Full structure for training (if needed as a static export)
export const ALL_QUIZZES = {
  genAi: genAiQuizzes,
  m1: m1Quizzes,
  m2: m2Quizzes
};

// Function for lazy loading (recommended for the update of AIQuiz.tsx)
export const getQuizData = async (moduleId: string, chapterId: string): Promise<Question[]> => {
  try {
    switch (moduleId) {
      case 'M1': {
        const m1Data: any = await import('./m1.json');
        if (chapterId === 'M1C1') {
          const genAiData: any = await import('./gen-ai.json');
          return genAiData.level1;
        }
        return m1Data[chapterId.toLowerCase().replace('m1', '')] || [];
      }
      case 'M2': {
        const m2Data: any = await import('./m2.json');
        return m2Data[chapterId.toLowerCase().replace('m2', '')] || [];
      }
      case 'GEN_AI': {
        const genAiData: any = await import('./gen-ai.json');
        return genAiData[chapterId.toLowerCase()] || genAiData.level1;
      }
      default:
        const genAiData: any = await import('./gen-ai.json');
        return genAiData.level1;
    }
  } catch (error) {
    console.error('Error loading quiz data:', error);
    return [];
  }
};
