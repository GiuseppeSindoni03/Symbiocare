// Node.js 18+ ha fetch nativo, non serve node-fetch

async function httpPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Errore HTTP ${res.status}: ${text}`);
  }

  return res.json().catch(() => null);
}

module.exports = { httpPost };
