import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
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
          content: `Проанализируй сайт:\n\n${text}\n\nОтветь строго JSON:\n{\"score\": number 0-100, \"issues\": string[], \"verdict\": string, \"explanation\": string}`,
        },
      ],
    });

    const content = ai.choices[0].message.content || "{}";
    // Clean markdown if present
    const cleaned = content.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "AI error" }, { status: 500 });
  }
}
