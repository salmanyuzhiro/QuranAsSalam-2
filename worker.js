const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const TAVILY_API = 'https://api.tavily.com/search';
const ALLOWED_ORIGIN = '*';

// Ambil pertanyaan terakhir dari user untuk dijadikan query search
function ambilQueryTerakhir(messages) {
  const pesanUser = (messages || []).filter(m => m.role === 'user');
  const terakhir = pesanUser[pesanUser.length - 1];
  return terakhir?.content?.slice(0, 400) || '';
}

// Panggil Tavily, kembalikan teks konteks siap-pakai (atau '' kalau gagal/kosong)
async function cariKonteksInternet(query, apiKey) {
  if (!query || !apiKey) return '';
  try {
    const res = await fetch(TAVILY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: 3,
      }),
    });
    if (!res.ok) return '';
    const data = await res.json();
    const hasil = data?.results || [];
    if (!hasil.length) return '';
    return hasil
      .map(r => `- ${r.title}: ${(r.content || '').slice(0, 500)}`)
      .join('\n');
  } catch {
    // Kalau Tavily error/timeout, jangan sampai gagalkan seluruh chat — lanjut tanpa konteks internet
    return '';
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return new Response('Not found', { status: 404 });
    }

    try {
      const body = await request.json();

      // Konversi format Anthropic messages -> Gemini contents
      const contents = (body.messages || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Cari konteks internet terbaru lewat Tavily berdasarkan pertanyaan terakhir user
      const queryTerakhir = ambilQueryTerakhir(body.messages);
      const konteksInternet = await cariKonteksInternet(queryTerakhir, env.TAVILY_API_KEY);

      let systemPrompt = body.system || '';
      if (konteksInternet) {
        systemPrompt += `\n\nInformasi terbaru dari internet (gunakan jika relevan, jangan sebut sumbernya secara mentah):\n${konteksInternet}`;
      }

      const geminiRes = await fetch(
        `${GEMINI_API}?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: systemPrompt
              ? { parts: [{ text: systemPrompt }] }
              : undefined,
            generationConfig: {
              maxOutputTokens: body.max_tokens || 1000,
            },
          }),
        }
      );

      const data = await geminiRes.json();
      const teks = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Bungkus balik ke format yang dipakai script.js (data.content[0].text)
      return new Response(JSON.stringify({ content: [{ text: teks }] }), {
        status: geminiRes.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }
  },
};