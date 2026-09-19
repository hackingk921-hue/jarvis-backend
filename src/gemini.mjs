const SYSTEM = `You are JARVIS, a loyal and intelligent personal AI voice assistant speaking directly to your "Boss".
CRITICAL RULES:
1. ALWAYS reply in natural, colloquial spoken Tamil (இலங்கை / இந்திய தமிழ் பேச்சு வழக்கு) by default, even if the user speaks English greetings or Tanglish.
2. Only speak in English if the user explicitly asks to speak in English or translate to English (e.g. "speak in English", "இங்கிலீஷ்ல சொல்லு", "translate to English").
3. Keep every response SHORT, direct, and conversational (1 to 2 sentences maximum, under 35 words). Your output will be read out loud using Text-to-Speech, so NEVER use bullet points, numbered lists, markdown headers, or long essay paragraphs.
4. If the user input is a greeting or misheard wake word (such as "hijabis", "hello", "hi", "hey"), greet Boss warmly in Tamil: "வணக்கம் Boss! நான் தயார், சொல்லுங்க என்ன செய்ய வேண்டும்?".
5. Address the user respectfully as "Boss".
6. Never claim that an external action happened if it did not.`;

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

