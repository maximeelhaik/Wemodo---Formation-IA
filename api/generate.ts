import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!GEMINI_API_KEY) {
    console.error("[BACK] Erreur: GEMINI_API_KEY manquante");
    return new Response(JSON.stringify({ error: "Clé API Gemini manquante dans l'environnement." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Lecture du body sécurisée
  let mission = "";
  try {
    const body = await req.json();
    mission = body.mission;
  } catch (e) {
    return new Response(JSON.stringify({ error: "Requête invalide" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!mission) {
    return new Response(JSON.stringify({ error: "Le champ 'mission' est manquant." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(`[BACK] Reçu: "${mission}" | Modèle: ${GEMINI_MODEL}`);
  const aiStartTime = Date.now();

  // On crée le stream et on le retourne IMMÉDIATEMENT
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Amorçage immédiat pour réduire le TTFB perçu
      controller.enqueue(encoder.encode(' '));
      console.log(`[BACK] Stream Amorcé (0ms)`);

      try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        let response;
        let retries = 0;
        const maxRetries = 2;

        const isGemma = GEMINI_MODEL.toLowerCase().includes("gemma");
        const systemInstruction = `Tu es un Expert en Productivité IA. Ta mission est de générer 5 cas d'usage concrets et immédiats pour la mission fournie.
        Chaque cas doit être un objet JSON valide avec :
        - title: Titre court résumant le cas d'usage (max 5 mots).
        - timeSaved: Estimation réaliste du temps gagné (ex: "2h/jour", "4h/semaine").
        - action: La description du cas d'unsage (20 à 30 mots).
        - icon: Un seul emoji représentatif.

        IMPORTANT : Sépare STRICTEMENT chaque objet par le délimiteur : ---END_OF_CASE---
        Règles : PAS de crochets [ ], PAS d'introduction, PAS de conclusion, Français uniquement.`;

        while (retries < maxRetries) {
          try {
            console.log(`[BACK] Appel AI (essai ${retries + 1}) | Modèle: ${GEMINI_MODEL}`);
            response = await ai.interactions.create({
              model: GEMINI_MODEL,
              input: isGemma ? `${systemInstruction}\n\nMission : ${mission}` : `Mission : ${mission}`,
              system_instruction: isGemma ? undefined : systemInstruction,
              stream: true,
              generation_config: {
                temperature: 0.2,
                max_output_tokens: 1000,
              }
            });
            break;
          } catch (e: any) {
            retries++;
            if (e.status === 503 && retries < maxRetries) {
              console.warn(`[BACK] 503 détecté, retry...`);
              await new Promise(r => setTimeout(r, 800));
              continue;
            }
            throw e;
          }
        }

        console.log(`[BACK] AI a commencé à répondre (+${Date.now() - aiStartTime}ms)`);

        for await (const event of response) {
          if (event.event_type === 'content.delta' && 'text' in event.delta) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error: any) {
        console.error("[BACK] Stream Error:", error);
        // On envoie l'erreur dans le flux pour que le front puisse la voir si possible
        controller.enqueue(encoder.encode(`---ERROR---${error.message || "Erreur AI"}`));
      } finally {
        console.log(`[BACK] Stream Fermé (Total: ${Date.now() - aiStartTime}ms)`);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
      'X-Model-Used': GEMINI_MODEL || 'default',
    },
  });
}
