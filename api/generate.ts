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

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: [
        { role: 'user', parts: [{ text: `Mission : "${mission}"` }] }
      ],
      config: {
        systemInstruction: `Expert Productivité IA. Génère 5 cas d'usage pour la mission fournie.
        Chaque cas est un objet JSON avec :
        - title: Titre court et percutant.
        - timeSaved: Gain estimé (ex: "3h/semaine").
        - action: Description concrète de ce que l'IA va faire.
        - icon: Un emoji représentatif.

        IMPORTANT : Sépare chaque objet par le délimiteur exact : ---END_OF_CASE---
        Règles : Pas de crochets [ ], pas de blabla, Français uniquement.`,
        temperature: 0.1,
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(' ')); // Espace d'amorçage

        try {
          for await (const chunk of response) {
            const text = chunk.text || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
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
