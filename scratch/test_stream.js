import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testStream() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Tu es un expert en ingénierie de prompt. Analyse ce prompt : "Bonjour" Donne une note sur 10 et un conseil. Réponds au format JSON: {"score": number, "feedback": "string"}` }] }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    console.log("--- CHUNK ---");
    console.log(chunk);
    fullContent += chunk;
  }
  console.log("--- FULL ---");
  console.log(fullContent);
}

testStream();
