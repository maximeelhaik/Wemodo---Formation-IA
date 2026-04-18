import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt field" });

  try {
    // generateContent (pas streamGenerateContent) = compatible avec response_mime_type JSON
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es un expert en ingénierie de prompt.
Analyse ce prompt : "${prompt}"
Donne une note sur 10 (pertinence, clarté, contexte) et un conseil de correction ultra-actionnable et pro.
Réponds UNIQUEMENT au format JSON strict sans texte autour : {"score": number, "feedback": "string"}`
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.4
        }
      })
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.json();
      console.error("Gemini API error:", JSON.stringify(errorBody));
      throw new Error(errorBody.error?.message || `Gemini HTTP ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Empty Gemini response:", JSON.stringify(data));
      throw new Error("Réponse vide de Gemini");
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);

  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
