import { VercelRequest, VercelResponse } from '@vercel/node';

// On utilise fetch pour éviter d'imposer l'installation de @vercel/kv si npm ne marche pas
// Mais Vercel KV fournit déjà les variables d'env KV_REST_API_URL et KV_REST_API_TOKEN
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvFetch(command: string[]) {
  const response = await fetch(`${KV_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await response.json();
  return data.result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS basic headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: "KV environment variables are missing. Please link KV in Vercel dashboard." });
  }

  const STORAGE_KEY = 'global-leaderboard';

  try {
    if (req.method === 'GET') {
      const data = await kvFetch(['GET', STORAGE_KEY]);
      const scores = data ? JSON.parse(data) : [];
      return res.status(200).json(scores);
    }

    if (req.method === 'POST') {
      const newEntry = req.body;
      if (!newEntry.username || !newEntry.appId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get existing scores
      const existingData = await kvFetch(['GET', STORAGE_KEY]);
      let scores = existingData ? JSON.parse(existingData) : [];

      // Add new entry and sort
      scores.push({
        ...newEntry,
        date: new Date().toISOString()
      });

      // Sort by score/total (desc) then date (desc)
      scores.sort((a: any, b: any) => {
        const scoreDiff = (b.score / b.total) - (a.score / a.total);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Keep top 100
      scores = scores.slice(0, 100);

      // Save back to KV
      await kvFetch(['SET', STORAGE_KEY, JSON.stringify(scores)]);
      
      return res.status(200).json(scores);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("KV Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
