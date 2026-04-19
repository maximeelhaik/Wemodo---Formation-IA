import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY_ARCHITECT || process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

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
    return res.status(500).json({ error: "GEMINI_API_KEY is missing (neither GEMINI_API_KEY_ARCHITECT nor GEMINI_API_KEY was found)." });
  }

  const { intention } = req.body;

  if (!intention) {
    return res.status(400).json({ error: "Missing intention field" });
  }

  try {
    const promptSystem = `Expert Midjourney Wemodo. Transforme l'intention en 3 prompts optimisés.
    Règles :
    1. Sujet, Action, Environnement, Lumière, Style.
    2. Paramètres (--ar, --stylize, --chaos, --weird, --tile, --no, --style raw) déduits de l'intention. 
    3. PAS de paramètre de version (--v).
    4. "visual_prompt" en ANGLAIS. "style_name" et emoji en FRANÇAIS.
    
    Format: JSON Array d'objets (visual_prompt, parameters, style_name, icon).
    Intention : "${intention}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptSystem }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          temperature: 0.4,
          max_output_tokens: 1000
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
    console.error("Gemini Midjourney Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
