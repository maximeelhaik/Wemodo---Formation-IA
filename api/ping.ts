export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  return new Response("pong", {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
