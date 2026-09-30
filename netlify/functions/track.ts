import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function ok() {
  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return ok();
  }

  try {
    let payload: {
      event_type?: string;
      target?: string;
      article_id?: string;
      session_id?: string;
    } = {};

    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return ok();
    }

    const url = process.env.SUPABASE_URL?.trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !serviceKey) {
      return ok();
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const headers = event.headers || {};
    const userAgent =
      headers["user-agent"] || headers["User-Agent"] || "";
    const referrer =
      headers["referer"] || headers["Referer"] || headers["referrer"] || "";

    await supabase.from("affiliate_clicks").insert({
      event_type: String(payload.event_type || "click").slice(0, 120),
      target: String(payload.target || "").slice(0, 500),
      article_id: payload.article_id
        ? String(payload.article_id).slice(0, 120)
        : null,
      session_id: payload.session_id
        ? String(payload.session_id).slice(0, 120)
        : null,
      user_agent: String(userAgent).slice(0, 500),
      referrer: String(referrer).slice(0, 500),
    });
  } catch {
    /* silent failure — never break the frontend */
  }

  return ok();
};
