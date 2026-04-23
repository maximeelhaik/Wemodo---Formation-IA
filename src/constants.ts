import { Module } from "./types";
export * from "./data/quizzes";

export const TRAINING_QUIZ_STRUCTURE: Module[] = [
  {
    id: "M1",
    title: "Module 1",
    description: "Introduction & Veille",
    color: "bg-[#FF3BFF]", // Wemodo Pink
    chapters: [
      { id: "M1C1", title: "Introduction" },
      { id: "M1C2", title: "Qu'est ce que l'IA" },
      { id: "M1C3", title: "IA en contexte pro" },
      { id: "M1C4", title: "Veille IA" },
    ]
  },
  {
    id: "M2",
    title: "Module 2",
    description: "IA Génératives & Prompting",
    color: "bg-[#E63AD9]",
    chapters: [
      { id: "M2C1", title: "Fonctionnement IA génératives" },
      { id: "M2C2", title: "IA et créativité" },
      { id: "M2C3", title: "IA et productivité" },
      { id: "M2C4", title: "Selectionner un outil" },
      { id: "M2C5", title: "Introduction Prompt Ingeneering" },
      { id: "M2C6", title: "Structurer Optimiser un prompt" },
      { id: "M2C7", title: "Enjeux Ethiques AI Act" },
      { id: "M2C8", title: "RGPD Accessibilité & Handicap" },
    ]
  },
  {
    id: "M3",
    title: "Module 3",
    description: "Maîtriser ChatGPT",
    color: "bg-[#CC3AC6]",
    chapters: [
      { id: "M3C4", title: "Le mode agent dans ChatGPT" },
      { id: "M3C5", title: "Forces et Faiblesses de ChatGPT" },
    ]
  },
  {
    id: "M4",
    title: "Module 4",
    description: "Maîtriser Midjourney",
    color: "bg-[#B33AB3]",
    chapters: [
      { id: "M4C1", title: "Prendre en main Midjourney" },
      { id: "M4C2", title: "Le prompting dans Midjourney" },
      { id: "M4C4", title: "Forces & Faiblesses de Midjourney" },
    ]
  },
  {
    id: "M5",
    title: "Module 5",
    description: "Projets & cas professionnels",
    color: "bg-[#993AA0]",
    chapters: [
      { id: "M5C1", title: "Les posts LinkedIn" },
      { id: "M5C2", title: "Les visuels Instagram" },
      { id: "M5C3", title: "Calendriers Éditoriaux et IA" },
    ]
  },
  {
    id: "M6",
    title: "Module 6",
    description: "Découvrir d'autres LLM",
    color: "bg-[#803A8D]",
    chapters: [
      { id: "M6C1", title: "Maîtriser Gemini (Google)" },
      { id: "M6C2", title: "Maîtriser Claude (Anthropic)" },
    ]
  },
  {
    id: "M7",
    title: "Module 7",
    description: "Découvrirs d'autres IA visuelles",
    color: "bg-[#6634D9]", // Wemodo Purple
    chapters: [
      { id: "M7C1", title: "Créer des images avec GPT Image" },
      { id: "M7C2", title: "Maîtriser Adobe Firefly" },
    ]
  }
];
