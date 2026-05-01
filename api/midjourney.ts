import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  const { intention, styles } = req.body;

  if (!intention) {
    return res.status(400).json({ error: "Missing intention field" });
  }

  const stylesText = styles && styles.length > 0
    ? `\nSTYLES À APPLIQUER : ${styles.join(', ')}.`
    : "";

  try {
    const promptSystem = `Expert Midjourney (Wemodo). Crée 1 SEUL prompt ultra-optimisé.
    
    RÈGLES DE STRUCTURE :
    1. "visual_prompt" : Description visuelle en ANGLAIS.
    2. "parameters" : Paramètres Midjourney (ex: --ar 16:9 --raw).
    3. "summary" : Un résumé très court de l'intention en FRANÇAIS (ex: "Café Parisien", "Portrait Cyberpunk"). MAX 3 mots. NE JAMAIS inclure d'emoji ici.
    4. "icon" : Un seul emoji représentatif.
    
    RÈGLES CRITIQUES :
    - INTERDICTION de répéter les paramètres.
    - INTERDICTION de mettre des paramètres dans "visual_prompt".
    - Paramètres autorisés : --ar, --stylize, --chaos, --weird, --tile, --no, --raw.
    - Pour le mode raw, utilise exclusivement "--raw".
    - PAS de paramètre de version (--v).${stylesText}
    
    Format JSON: OBJET UNIQUE (pas d'array car un seul prompt) avec les clés (visual_prompt, parameters, summary, icon).
    Intention : "${intention}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptSystem }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1,
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

    console.log("Raw Midjourney response:", content);

    try {
      const parsed = JSON.parse(content.trim());
      return res.status(200).json(parsed);
    } catch (parseError) {
      console.warn("Direct JSON parse failed, attempting extraction:", parseError);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          return res.status(200).json(extracted);
        } catch (secondError) {
          console.error("Extraction JSON parse failed:", secondError);
          throw new Error("Format de réponse JSON invalide");
        }
      }
      throw new Error("Impossible d'extraire le JSON de la réponse");
    }

  } catch (error: any) {
    console.error("Gemini Midjourney Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
