import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY_MISSION || process.env.GEMINI_API_KEY;
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
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is missing." }), { status: 500 });
  }

  const { mission } = await req.json();

  if (!mission) {
    return new Response(JSON.stringify({ error: "Missing mission field" }), { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Stratégie de retry pour absorber les 503 temporaires de Gemini Flash Lite
    let response;
    let retries = 0;
    const maxRetries = 2;

    while (retries < maxRetries) {
      try {
        response = await ai.interactions.create({
          model: GEMINI_MODEL,
          input: `Mission : ${mission}`,
          stream: true,
          system_instruction: `Tu es un Expert en Productivité IA. Ta mission est de générer 5 cas d'usage concrets et immédiats pour la mission fournie.
          Chaque cas doit être un objet JSON valide avec :
          - title: Titre court (max 5 mots).
          - timeSaved: Estimation réaliste du temps gagné (ex: "2h/jour", "4h/semaine").
          - action: Instruction claire de ce que l'IA doit exécuter.
          - icon: Un seul emoji représentatif.

          IMPORTANT : Sépare STRICTEMENT chaque objet par le délimiteur : ---END_OF_CASE---
          Règles : PAS de crochets [ ], PAS d'introduction, PAS de conclusion, Français uniquement.`,
          generation_config: {
            temperature: 0.2,
            max_output_tokens: 1000,
          }
        });
        break;
      } catch (e: any) {
        retries++;
        if (e.status === 503 && retries < maxRetries) {
          await new Promise(r => setTimeout(r, 800));
          continue;
        }
        throw e;
      }
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(' ')); // Amorçage

        try {
          for await (const event of response) {
            // Dans le nouveau SDK, le texte est dans event.delta.text pour les événements content.delta
            if (event.event_type === 'content.delta' && 'text' in event.delta) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (e) {
          console.error("Stream Error:", e);
        } finally {
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
      },
    });

  } catch (error: any) {
    console.error("Gemini Edge Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
