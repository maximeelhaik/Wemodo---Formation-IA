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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "Clé API Gemini manquante." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const aiStartTime = Date.now();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Forcer l'amorçage
      controller.enqueue(encoder.encode(' '));

      try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.interactions.create({
          model: GEMINI_MODEL,
          input: "Réponds exactement 'Hello'",
          stream: true,
          generation_config: {
            temperature: 0.1,
            max_output_tokens: 10,
          }
        });

        for await (const event of response) {
          if (event.event_type === 'content.delta' && 'text' in event.delta) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error: any) {
        console.error("[BACK] AI Ping Stream Error:", error);
        controller.enqueue(encoder.encode(`---ERROR---${error.message || "Erreur AI"}`));
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
}
