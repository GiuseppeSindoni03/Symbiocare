// Node.js 18+ ha fetch nativo, non serve node-fetch

async function httpPost(url, body) {
  // Timeout di 10 secondi per evitare che la Logic App blocchi la function
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Logic App risponde con 200 (sincrono) o 202 Accepted (asincrono) → entrambi OK
    if (!res.ok && res.status !== 202) {
      const text = await res.text();
      throw new Error(`Errore HTTP ${res.status}: ${text}`);
    }

    return res.json().catch(() => null);
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      // Timeout: la Logic App impiega troppo, ma il messaggio è stato ricevuto
      // Non consideriamo questo un errore fatale
      console.warn("⏱️ Logic App timeout (>10s) — il messaggio potrebbe essere elaborato in ritardo");
      return null;
    }
    throw err;
  }
}

module.exports = { httpPost };
