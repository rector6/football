/**
 * Shared API-Football helpers:
 * - proxyFetch (HTTPS_PROXY / QuotaGuard)
 * - 429 exponential backoff (max 3 retries)
 * - rate-limit header logging
 * - daily quota guard via Supabase api_quota_log
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const QUOTA_SOFT_LIMIT = 80; // of ~100 free-tier daily

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function corsHeaders(originHeader?: string | null): Record<string, string> {
  const allowed = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let origin = "*";
  if (!(allowed.length === 1 && allowed[0] === "*")) {
    const req = originHeader || "";
    origin = allowed.includes(req) ? req : allowed[0] || "*";
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}

/**
 * Outbound fetch with optional HTTPS_PROXY (QuotaGuard / static IP).
 * Falls back to direct fetch if proxy unavailable.
 */
export async function proxyFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const proxy =
    process.env.HTTPS_PROXY?.trim() || process.env.https_proxy?.trim();
  const noProxy = process.env.NO_PROXY || process.env.no_proxy || "";

  if (proxy) {
    try {
      const host = new URL(url).hostname;
      const bypass = noProxy
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .some(
          (rule) =>
            rule === "*" ||
            host === rule ||
            (rule.startsWith(".") && host.endsWith(rule)),
        );
      if (!bypass) {
        // Node 20 includes undici; ProxyAgent routes TLS through QuotaGuard
        const undici = await import("undici");
        const agent = new undici.ProxyAgent(proxy);
        const res = await undici.fetch(url, {
          ...options,
          dispatcher: agent,
        } as any);
        return res as unknown as Response;
      }
    } catch (err) {
      console.warn(
        "[proxyFetch] proxy failed, using direct",
        err instanceof Error ? err.message : err,
      );
    }
  }
  return fetch(url, options);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function remainingFromHeaders(headers: Headers): number | null {
  const keys = [
    "x-ratelimit-requests-remaining",
    "x-ratelimit-remaining",
    "X-RateLimit-Remaining",
  ];
  for (const k of keys) {
    const v = headers.get(k);
    if (v != null && v !== "") {
      const n = parseInt(v, 10);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

/** Today's call count from api_quota_log */
export async function getTodayQuota(): Promise<number> {
  const sb = supabaseAdmin();
  if (!sb) return 0;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await sb
      .from("api_quota_log")
      .select("call_count")
      .eq("date", today)
      .maybeSingle();
    return Number(data?.call_count || 0);
  } catch {
    return 0;
  }
}

export async function canCallApiFootball(): Promise<boolean> {
  const count = await getTodayQuota();
  if (count >= QUOTA_SOFT_LIMIT) {
    console.warn(
      `[quota] soft limit reached (${count}/${QUOTA_SOFT_LIMIT}) — serving cache only`,
    );
    return false;
  }
  return true;
}

export async function incrementQuota(): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await sb
      .from("api_quota_log")
      .select("id, call_count")
      .eq("date", today)
      .maybeSingle();

    if (data?.id) {
      await sb
        .from("api_quota_log")
        .update({
          call_count: Number(data.call_count || 0) + 1,
          last_call_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    } else {
      await sb.from("api_quota_log").insert({
        date: today,
        call_count: 1,
        last_call_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn(
      "[quota] increment failed",
      err instanceof Error ? err.message : err,
    );
  }
}

export type ApiFootballResult = {
  ok: boolean;
  status: number;
  body: string;
  rateLimited?: boolean;
  remaining?: number | null;
};

/**
 * Call API-Football with:
 * - quota soft-limit check
 * - proxy
 * - 429 backoff (1s, 2s, 4s) max 3 retries
 * - remaining-header warnings
 */
export async function callApiFootball(
  path: string,
  params: Record<string, string> = {},
  opts?: { skipQuotaCheck?: boolean },
): Promise<ApiFootballResult> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      status: 503,
      body: JSON.stringify({ error: "API_FOOTBALL_KEY is not configured" }),
    };
  }

  if (!opts?.skipQuotaCheck) {
    const allowed = await canCallApiFootball();
    if (!allowed) {
      return {
        ok: false,
        status: 429,
        rateLimited: true,
        body: JSON.stringify({
          error: "Daily quota soft-limit reached; using cache",
        }),
      };
    }
  }

  const qs = new URLSearchParams(params);
  const url = `https://v3.football.api-sports.io/${path}?${qs.toString()}`;
  const headers = {
    "x-apisports-key": key,
    Accept: "application/json",
  };

  let lastStatus = 0;
  let lastBody = "";
  let remaining: number | null = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await proxyFetch(url, { headers });
      lastStatus = res.status;
      lastBody = await res.text();
      remaining = remainingFromHeaders(res.headers);

      if (remaining != null && remaining < 5) {
        console.warn(
          `[api-football] low remaining requests: ${remaining} (path=${path})`,
        );
      }

      if (res.status === 429) {
        if (attempt < 3) {
          const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
          console.warn(
            `[api-football] 429 rate limited, retry in ${delay}ms (attempt ${attempt + 1}/3)`,
          );
          await sleep(delay);
          continue;
        }
        return {
          ok: false,
          status: 429,
          rateLimited: true,
          remaining,
          body: JSON.stringify({
            error: "Rate limited, try again shortly",
          }),
        };
      }

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          remaining,
          body: JSON.stringify({
            error: `API-Football upstream ${res.status}`,
            detail: lastBody.slice(0, 500),
          }),
        };
      }

      await incrementQuota();
      return { ok: true, status: 200, body: lastBody, remaining };
    } catch (err) {
      lastBody = err instanceof Error ? err.message : "Upstream request failed";
      if (attempt < 3) {
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: lastBody }),
      };
    }
  }

  return {
    ok: false,
    status: lastStatus || 503,
    rateLimited: lastStatus === 429,
    remaining,
    body:
      lastBody ||
      JSON.stringify({ error: "Rate limited, try again shortly" }),
  };
}

export async function callApiFootballJson(
  path: string,
  params: Record<string, string> = {},
): Promise<any[]> {
  const result = await callApiFootball(path, params);
  if (!result.ok) return [];
  try {
    const json = JSON.parse(result.body);
    return Array.isArray(json?.response) ? json.response : [];
  } catch {
    return [];
  }
}
