import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    // 🔄 Check cache — if URL already analyzed, return existing result
    const { data: cached } = await supabase
      .from("projects")
      .select("*")
      .eq("url", url)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      return Response.json({ ...cached, cached: true });
    }

    // 1. Load website
    const { data } = await axios.get(url, {
      timeout: 8000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    // 2. Parse text
    const $ = cheerio.load(data);
    const text = $("body").text().replace(/\s+/g, " ").slice(0, 3000);

    // 3. AI analysis
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты эксперт по выявлению мошеннических инвестиционных проектов, MLM и криптоскамов. Отвечай ТОЛЬКО валидным JSON без markdown.",
        },
        {
          role: "user",
          content: `Проанализируй сайт:\n\n${text}\n\nОтветь строго JSON:\n{"score": number 0-100, "issues": string[], "verdict": string, "explanation": string}`,
        },
      ],
    });

    const content = ai.choices[0].message.content || "{}";
    const cleaned = content.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    // 4. Save to Supabase
    await supabase.from("projects").insert([{
      url,
      score: result.score,
      verdict: result.verdict,
      issues: result.issues,
      explanation: result.explanation,
    }]);

    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "AI error" }, { status: 500 });
  }
}
