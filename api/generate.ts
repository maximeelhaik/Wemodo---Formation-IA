import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS basic headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  const { mission } = req.body;

  if (!mission) {
    return res.status(400).json({ error: "Missing mission field" });
  }

  try {
    const promptSystem = `Tu es un expert en productivité IA pour Wemodo. Ta mission est de transformer la profession ou la mission fournie en 5 cas d'usage concrets et actionnables.
    Pour chaque cas d'usage, fournis : 
    1. title: Un titre court et percutant.
    2. timeSaved: Le gain de temps estimé (ex: "2h / semaine").
    3. action: Ce que l'IA va concrètement faire.
    4. prompt: Un exemple de prompt efficace pour cette tâche.
    5. icon: Un emoji représentatif.

    Profession/Mission à analyser: "${mission}"

    Format de réponse: Un tableau JSON de 5 objets avec les clés strictes: title, timeSaved, action, prompt, icon.
    Réponds uniquement en français.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptSystem }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Gemini API error");
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) throw new Error("No response from Gemini");

    return res.status(200).json(JSON.parse(content));

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
