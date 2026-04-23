import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY_MISSION || process.env.GEMINI_API_KEY;
async function main() {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    // Note: The new SDK might have a different way to list models, 
    // but usually there's a listModels or similar.
    // If not, I'll try a common one.
    console.log("Liste des modèles disponibles :");
    // Since I'm in a Node environment with the SDK, let's try to fetch them.
  } catch (e) {
    console.error(e);
  }
}
main();
