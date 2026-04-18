import dotenv from 'dotenv';
dotenv.config();
const apiKey = "AIzaSyC1JqCMrrF8NN8rziSKOcFA0TxikivA5JE";

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:streamGenerateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
  });
  console.log("Status:", res.status);
  if (res.ok) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const { value } = await reader.read();
    console.log("Chunk:", decoder.decode(value));
  } else {
    console.log("Error body:", await res.text());
  }
}
test();
