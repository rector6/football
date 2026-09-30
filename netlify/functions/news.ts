import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function supabase() {
  const url = process.env.SUPABASE_URL?.trim();
  // Prefer service role for reliable reads; anon also works with RLS select policy
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const sb = supabase();
  if (!sb) {
    return {
      statusCode: 503,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Supabase not configured", articles: [] }),
    };
  }

  const params = event.queryStringParameters || {};
  const category = String(params.category || "").trim();
  const id = String(params.id || "").trim();
  const limit = Math.min(
    50,
    Math.max(1, parseInt(String(params.limit || "24"), 10) || 24),
  );

  try {
    if (id) {
      const { data, error } = await sb
        .from("news_articles")
        .select(
          "id,title,summary,source,source_url,image,tags,category,published_at,created_at",
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return {
        statusCode: 200,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
        body: JSON.stringify({ articles: data ? [data] : [] }),
      };
    }

    let q = sb
      .from("news_articles")
      .select(
        "id,title,summary,source,source_url,image,tags,category,published_at,created_at",
      )
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (category && category.toLowerCase() !== "all") {
      q = q.ilike("category", category);
    }

    const { data, error } = await q;
    if (error) throw error;

    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({ articles: data || [] }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        articles: [],
        error: err instanceof Error ? err.message : "query failed",
      }),
    };
  }
};
