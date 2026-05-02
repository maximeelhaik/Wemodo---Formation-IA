import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  if (!GEMINI_API_KEY) {
    console.error("No Gemini API key found.");
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt field" });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es un expert en ingénierie de prompt.
Analyse ce prompt : ${JSON.stringify(prompt)}
Donne une note sur 10 (pertinence, clarté, contexte) et un conseil de correction ultra-actionnable et pro.
Ne donne pas la solution ou de prompt corrigé, juste un conseil sur ce qui est manquant ou pas clair.
Réponds UNIQUEMENT au format JSON strict avec la structure : {"score": number, "feedback": "string"}`
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: {
            type: "OBJECT",
            properties: {
              score: { type: "NUMBER", description: "Le score sur 10" },
              feedback: { type: "STRING", description: "Le conseil d'optimisation" }
            },
            required: ["score", "feedback"]
          },
          temperature: 0.3,
          maxOutputTokens: 500
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

    console.log("Raw Gemini response:", text);

    // Nettoyage robuste du texte retourné par Gemini
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/```$/, "");
    }
    cleanedText = cleanedText.trim();

    try {
      // Tentative de parsing direct du texte nettoyé
      const parsed = JSON.parse(cleanedText);
      
      // Validation des clés
      if (typeof parsed.score === 'undefined' || typeof parsed.feedback === 'undefined') {
        throw new Error("Missing required keys in response");
      }
      return res.status(200).json(parsed);
    } catch (parseError) {
      console.warn("Direct JSON parse failed, attempting regex extraction:", parseError);

      // Extraction via regex
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          if (typeof extracted.score !== 'undefined' && typeof extracted.feedback !== 'undefined') {
            return res.status(200).json(extracted);
          }
        } catch (secondError) {
          console.error("Extraction JSON parse failed:", secondError);
        }
      }

      // Si tout a échoué, on crée un fallback propre
      return res.status(200).json({
        score: 5,
        feedback: "Le prompt a pu être analysé mais le format de retour de l'IA était incorrect. Pensez à bien structurer les instructions."
      });
    }

  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
