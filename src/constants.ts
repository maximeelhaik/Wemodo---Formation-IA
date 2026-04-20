import { Module } from "./types";
export * from "./data/quizzes";

export const TRAINING_QUIZ_STRUCTURE: Module[] = [
  {
    id: "M1",
    title: "Module 1",
    description: "Introduction & Culture IA",
    color: "bg-wemodo-yellow",
    chapters: [
      { id: "M1C1", title: "M1C1 - Intro" },
      { id: "M1C2", title: "M1C2 - Qu'est ce que l'IA", isUpdated: true },
      { id: "M1C3", title: "M1C3 - IA en cotexte pro", isUpdated: true },
      { id: "M1C4", title: "M1C4 - Veille IA", isUpdated: true },
    ]
  },
  {
    id: "M2",
    title: "Module 2",
    description: "Maîtrise & Outils",
    color: "bg-wemodo-pink",
    chapters: [
      { id: "M2C1", title: "M2C1 - Fonctionnement IA génératives", isUpdated: true },
      { id: "M2C2", title: "M2C2 - IA et créactivité", isUpdated: true },
      { id: "M2C3", title: "M2C3 - IA et productivité", isUpdated: true },
      { id: "M2C4", title: "M2C4 - Selectionner un outil", isUpdated: true },
      { id: "M2C5", title: "M2C5 - Introduction Prompt Ingeneering", isUpdated: true },
      { id: "M2C6", title: "M2C6 - Structurer Optimiser un prompt", isUpdated: true },
      { id: "M2C7", title: "M2C7 - Enjeux Ethiques AI Act", isUpdated: true },
      { id: "M2C8", title: "M2C8 - RGPD Accessibilité Handicap", isUpdated: true },
    ]
  }
];
