import type { Config, Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import Parser from "rss-parser";
import { GoogleGenAI } from "@google/genai";

const parser = new Parser({
  timeout: 12000,
  headers: {
    "User-Agent": "FootballFansTribe/1.0 (+https://footbalfan.netlify.app)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function heuristicSummary(title: string, description: string): {
  summary: string;
  tags: string[];
  category: string;
} {
  const desc = String(description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const first =
    desc.split(/(?<=[.!?])\s+/)[0] ||
    title ||
    "Football news update from the Tribe desk.";
  const summary =
    first.length > 40
      ? first.slice(0, 280)
      : `${title}. ${first}`.slice(0, 280);
  const lower = `${title} ${desc}`.toLowerCase();
  let category = "Match Reports";
  if (/transfer|sign|deal|loan|fee/.test(lower)) category = "Transfers";
  else if (/analysis|tactical|why|how/.test(lower)) category = "Analysis";
  else if (/nigeria|super eagles|npfl|afcon|naija/.test(lower))
    category = "Nigeria";
  const tags: string[] = [];
  if (/arsenal|chelsea|liverpool|manchester|tottenham/.test(lower))
    tags.push("EPL");
  if (/nigeria|eagles|npfl/.test(lower)) tags.push("Nigeria");
  if (/champions league|ucl/.test(lower)) tags.push("UCL");
  return { summary, tags: tags.slice(0, 4), category };
}

async function summarizeWithGemini(
  title: string,
  description: string,
): Promise<{ summary: string; tags: string[]; category: string }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return heuristicSummary(title, description);

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt =
      "You are a sports editor. Using ONLY this headline and description, " +
      "write a 2-sentence factual summary. Do not invent facts. " +
      "Return JSON only: { \"summary\": string, \"tags\": string[], \"category\": string }. " +
      "category must be one of: Transfers, Match Reports, Analysis, Nigeria. " +
      `Headline: ${title}. Description: ${description.slice(0, 1200)}.`;

    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      }),
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("gemini timeout")), 15000),
      ),
    ]);

    const text = String((response as any)?.text || "");
    const parsed = JSON.parse(text);
    const summary = String(parsed.summary || "").trim();
    if (summary.length < 20) return heuristicSummary(title, description);
    return {
      summary: summary.slice(0, 500),
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map(String).slice(0, 6)
        : [],
      category: String(parsed.category || "Match Reports").slice(0, 40),
    };
  } catch (err) {
    console.warn(
      "[news-ingest] Gemini fallback","
      err instanceof Error ? err.message : err,
    );
    return heuristicSummary(title, description);
  }
}

function pickImage(item: any): string | null {
  const enc = item?.enclosure?.url || item?.enclosures?.[0]?.url;
  if (enc && /^https?:\/\//i.test(enc)) return String(enc);
  const media =
    item?.["media:content"]?.$?.url ||
    item?.["media:thumbnail"]?.$?.url;
  if (media && /^https?:\/\//i.test(media)) return String(media);
  const html = String(item?.content || item?.contentSnippet || "");
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m?.[1] && /^https?:\/\//i.test(m[1])) return m[1];
  return null;
}

export async function runNewsIngest(): Promise<{
  inserted: number;
  scanned: number;
  errors: string[];
}> {
  const sb = supabaseAdmin();
  if (!sb) {
    console.error("[news-ingest] Missing Supabase env");
    return { inserted: 0, scanned: 0, errors: ["no supabase"] };
  }

  const { data: sources, error: srcErr } = await sb
    .from("news_sources")
    .select("id,name,rss_url,category")
    .eq("active", true);

  if (srcErr || !sources?.length) {
    console.error("[news-ingest] sources", srcErr?.message || "empty");
    return {
      inserted: 0,
      scanned: 0,
      errors: [srcErr?.message || "no sources"],
    };
  }

  let inserted = 0;
  let scanned = 0;
  const errors: string[] = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.rss_url);
      const items = (feed.items || []).slice(0, 10);
      scanned += items.length;

      for (const item of items) {
        const title = String(item.title || "").trim();
        const link = String(item.link || item.guid || "").trim();
        if (!title || !link) continue;

        const { data: existing } = await sb
          .from("news_articles")
          .select("id")
          .eq("source_url", link)
          .maybeSingle();
        if (existing) continue;

        const description = String(
          item.contentSnippet || item.content || item.summary || "",
        )
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const ai = await summarizeWithGemini(title, description);
        const published =
          item.isoDate || item.pubDate
            ? new Date(item.isoDate || item.pubDate!).toISOString()
            : new Date().toISOString();

        const { error: insErr } = await sb.from("news_articles").insert({
          title: title.slice(0, 300),
          summary: ai.summary,
          source: source.name,
          source_url: link,
          image: pickImage(item),
          tags: ai.tags,
          category: ai.category || source.category || "Match Reports",
          published_at: published,
        });

        if (insErr) {
          if (!/duplicate|unique/i.test(insErr.message)) {
            errors.push(`${source.name}: ${insErr.message}`);
          }
        } else {
          inserted += 1;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[news-ingest] RSS failed", source.name, msg);
      errors.push(`${source.name}: ${msg}`);
      // continue — never crash the cron
    }
  }

  console.log("[news-ingest] done", { inserted, scanned, errors: errors.length });
  return { inserted, scanned, errors };
}

/** Scheduled every 30 minutes */
export default async () => {
  const result = await runNewsIngest();
  console.log("[news-ingest] scheduled", result);
};

export const config: Config = {
  schedule: "*/30 * * * *",
};

/** Manual HTTP trigger: GET/POST /api/news-ingest */
export const handler: Handler = async () => {
  try {
    const result = await runNewsIngest();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, ...result }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : "ingest failed",
      }),
    };
  }
};
