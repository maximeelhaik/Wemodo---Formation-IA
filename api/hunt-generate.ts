import { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY_MISSION || process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
  }

  const { theme, persona, hallsCount, clichesCount, maxWords } = req.body;
  const targetTheme = theme || "L'intelligence Artificielle et son impact sur la société";
  const targetPersona = persona || "un rédacteur professionnel au style neutre";
  const finalHallsCount = hallsCount ?? 1;
  const finalClichesCount = clichesCount ?? 1;
  const finalMaxWords = Math.min(maxWords ?? 200, 250);

  const prompt = `Tu es un expert en rédaction et en création de pièges pour un jeu de détection d'IA.

MISSION :
Rédige un texte organique et humain d'environ ${finalMaxWords} mots sur le thème : "${targetTheme}".
Adopte ce persona : "${targetPersona}".

CONSIGNES DE RÉDACTION :
- Style humain, vivant, avec des variations de rythme (phrases courtes/longues).
- Pas de structure scolaire (Intro/Conclusion classiques).
- Pas de listes à puces.
- Interdiction d'utiliser : "De plus", "En outre", "En conclusion", "Il est important de noter", etc.

PIÈGES À INJECTER :
1. Injecte exactement ${finalHallsCount} HALLUCINATION(S): Informations de 5 mots maximum qui mériteraient un fact-check: erreur factuelle crédible, statistique non exacte, date décalée, citation inventée, nom propre érroné.
2. Injecte exactement ${finalClichesCount} CLICHÉ(S) IA : Formulation  de 5 mots maximum avec enthousiasme générique, meta-commentaire sur le sujet ou autre formulations typique des LLM.

DÉCOUPAGE EN SEGMENTS (CRUCIAL) :
Tu dois découper l'intégralité du texte en un tableau de segments JSON.
RÈGLES DE DÉCOUPAGE :
- Chaque segment doit contenir entre 2 et 5 mots.
- Un segment ne doit JAMAIS commencer ou inclure au milieu  une ponctuation isolée (virgule, point, retour à la ligne). La ponctuation doit être intégrée à la fin du segment (ex: "dans ce cas," et non "dans ce cas" suivi de ",").
- Les segments de type 'hallucination' ou 'cliche' doivent correspondre exactement aux mots du piège. Si le piège fait 3 mots, son segment fait 3 mots.
- Tous les autres segments sont de type 'none'.
- L'ordre des segments doit reconstituer fidèlement le texte original avec ses espaces et sa ponctuation.

FORMAT DE RÉPONSE (JSON UNIQUEMENT) :
{
  "segments": [
    { "text": "Le texte du segment", "type": "none" },
    { "text": " l'erreur factuelle", "type": "hallucination", "explanation": "Pourquoi c'est faux..." },
    { "text": " une expression cliché", "type": "cliche", "explanation": "Pourquoi c'est un cliché IA..." },
    ...
  ]
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.9,
          maxOutputTokens: 8000
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`API Error: ${err.error?.message}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("AI returned empty result");

    const parsed = JSON.parse(resultText);
    return res.status(200).json(parsed);

  } catch (error: any) {
    console.error("Hunt Generator Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

