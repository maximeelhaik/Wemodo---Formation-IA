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

  const { theme, hallsCount, clichesCount, maxWords } = req.body;
  const targetTheme = theme || "L'intelligence Artificielle et son impact sur la société";
  const finalHallsCount = hallsCount ?? 1;
  const finalClichesCount = clichesCount ?? 1;
  const finalMaxWords = maxWords ?? 200;

  const systemPrompt = `Tu es un expert en copywriting utilisé pour nourir un mini-jeu de détection d'hallucination d'IA.
Ta mission est de générer un texte continu et naturel (human like) d'environ ${finalMaxWords} mots qui traite du thème suivant : "${targetTheme}" et qui integre subtilement des pièges à identifier par l'utilisateur.

TYPES DE PIÈGES :
1. HALLUCINATION : hallucinations courantes faites par les LLM, faits qui méritent d'être vérifiés manuellement par l'utilisateur. Pas de faits absurdes. 
2. CLICHÉ : Des tournures "AI-like" faites couramment par les LLM et qui peuvent trahir l'utilisation d'une IA

RÈGLES DE DENSITÉ ET FORMATAGE :
- Ton texte final DOIT contenir exactement ${finalHallsCount} hallucination(s) et ${finalClichesCount} cliché(s).
- Intègre ces pièges naturellement dans le texte.
- Pour identifier chaque piège, tu DOIS insérer des balises XML autour des mots exacts du piège (2 à 5 mots max par piège).
Utilise la syntaxe suivante :
<hallucination explication="Explication courte">les mots du piège</hallucination>
<cliche explication="Explication courte">les mots du cliché</cliche>


STRUCTURE DE SORTIE (JSON UNIQUEMENT) :
Renvoie UNIQUEMENT un objet JSON valide avec une seule clé "texte_marque" contenant la totalité de ton texte balisé. Échappe correctement les guillemets.
{
  "texte_marque": "Le texte avec les balises intégrées"
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      })
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.json();
      throw new Error(errorBody.error?.message || `Gemini Error ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Réponse vide de Gemini");

    const parsed = JSON.parse(text);
    const texteMarque = parsed.texte_marque;

    if (!texteMarque) {
      // Fallback
      return res.status(200).json(parsed);
    }

    const regex = /<(hallucination|cliche)\s+explication="([^"]+)">([\s\S]*?)<\/\1>/g;
    const segments: { text: string, type: string, explanation?: string }[] = [];
    let lastIndex = 0;
    let match;

    function chunkText(str: string, type: string) {
      const words = str.split(/(\s+)/).filter((w: string) => w.length > 0);
      const chunks: typeof segments = [];
      let currentChunk = "";
      let wordCount = 0;
      let targetLength = Math.floor(Math.random() * 4) + 2;

      for (const token of words) {
        currentChunk += token;
        if (token.trim() !== '') wordCount++;

        if (wordCount >= targetLength) {
          chunks.push({ text: currentChunk, type });
          currentChunk = "";
          wordCount = 0;
          targetLength = Math.floor(Math.random() * 4) + 2;
        }
      }

      if (currentChunk.trim().length > 0 || (currentChunk.length > 0 && chunks.length > 0)) {
        if (currentChunk.trim().length === 0 && chunks.length > 0) {
          chunks[chunks.length - 1].text += currentChunk;
        } else {
          chunks.push({ text: currentChunk, type });
        }
      }
      return chunks;
    }

    while ((match = regex.exec(texteMarque)) !== null) {
      const beforeText = texteMarque.substring(lastIndex, match.index);
      if (beforeText) {
        segments.push(...chunkText(beforeText, 'none'));
      }
      segments.push({
        text: match[3],
        type: match[1],
        explanation: match[2]
      });
      lastIndex = regex.lastIndex;
    }

    const afterText = texteMarque.substring(lastIndex);
    if (afterText) {
      segments.push(...chunkText(afterText, 'none'));
    }

    return res.status(200).json({ segments });

  } catch (error: any) {
    console.error("Hunt Generator Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
