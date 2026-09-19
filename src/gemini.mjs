const SYSTEM = `You are JARVIS, a private personal assistant. Reply naturally in the user's language.
For Tamil, understand colloquial Sri Lankan and Indian Tamil and respond simply.
Never claim that an action happened. You may only suggest an action using plain text;
the trusted client must preview and confirm any external action. Never request passwords,
OTP codes, bank credentials, or API keys.`;

export async function askGemini({ apiKey, model, message }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 700,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }),
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Gemini request failed (${response.status}): ${errorBody || response.statusText}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || 'பதில் கிடைக்கவில்லை.';
}

