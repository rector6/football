/** Client helpers — talk only to /api/* (Netlify Functions). */

function sessionId(): string {
  try {
    const key = "fft_session";
    let id = localStorage.getItem(key);
    if (!id) {
      id = `s_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `s_anon_${Date.now()}`;
  }
}

/**
 * Proxy to API-Football via Netlify Function.
 * Example: fetchFootball('fixtures', { league: '39', season: '2024' })
 */
export async function fetchFootball<
  T = unknown,
>(
  endpoint: string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<T | null> {
  try {
    const qs = new URLSearchParams();
    qs.set("endpoint", endpoint);
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      qs.set(k, String(v));
    }
    const res = await fetch(`/api/football?${qs.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Fire-and-forget affiliate / engagement tracking. Always resolves. */
export async function trackClick(
  eventType: string,
  target: string,
  articleId?: string,
): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        target,
        article_id: articleId || null,
        session_id: sessionId(),
      }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
