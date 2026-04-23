import genAiQuizzes from './gen-ai.json';
import m1Quizzes from './m1.json';
import m2Quizzes from './m2.json';
import m3Quizzes from './m3.json';
import m4Quizzes from './m4.json';
import m5Quizzes from './m5.json';
import m6Quizzes from './m6.json';
import m7Quizzes from './m7.json';
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

// Module 3 Questions
export const QUIZ_M3C4 = cast(m3Quizzes.c4);
export const QUIZ_M3C5 = cast(m3Quizzes.c5);

// Module 4 Questions
export const QUIZ_M4C1 = cast(m4Quizzes.c1);
export const QUIZ_M4C2 = cast(m4Quizzes.c2);
export const QUIZ_M4C4 = cast(m4Quizzes.c4);

// Module 5 Questions
export const QUIZ_M5C1 = cast(m5Quizzes.c1);
export const QUIZ_M5C2 = cast(m5Quizzes.c2);
export const QUIZ_M5C3 = cast(m5Quizzes.c3);

// Module 6 Questions
export const QUIZ_M6C1 = cast(m6Quizzes.c1);
export const QUIZ_M6C2 = cast(m6Quizzes.c2);

// Module 7 Questions
export const QUIZ_M7C1 = cast(m7Quizzes.c1);
export const QUIZ_M7C2 = cast(m7Quizzes.c2);

// Full structure for training (if needed as a static export)
export const ALL_QUIZZES = {
  genAi: genAiQuizzes,
  m1: m1Quizzes,
  m2: m2Quizzes,
  m3: m3Quizzes,
  m4: m4Quizzes,
  m5: m5Quizzes,
  m6: m6Quizzes,
  m7: m7Quizzes
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
      case 'M3': {
        const m3Data: any = await import('./m3.json');
        return m3Data[chapterId.toLowerCase().replace('m3', '')] || [];
      }
      case 'M4': {
        const m4Data: any = await import('./m4.json');
        return m4Data[chapterId.toLowerCase().replace('m4', '')] || [];
      }
      case 'M5': {
        const m5Data: any = await import('./m5.json');
        return m5Data[chapterId.toLowerCase().replace('m5', '')] || [];
      }
      case 'M6': {
        const m6Data: any = await import('./m6.json');
        return m6Data[chapterId.toLowerCase().replace('m6', '')] || [];
      }
      case 'M7': {
        const m7Data: any = await import('./m7.json');
        return m7Data[chapterId.toLowerCase().replace('m7', '')] || [];
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
