import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type StormLevel = "low" | "monitor" | "alert";

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyStatus(text: string): { level: StormLevel; headline: string; body: string } {
  const lower = text.toLowerCase();

  if (lower.includes("no tropical cyclones") || lower.includes("no active tropical cyclones")) {
    return {
      level: "low",
      headline: "No storms showing right now.",
      body: "No active tropical cyclones are showing in the current storm signal. Storm tools will appear here if conditions change.",
    };
  }

  if (lower.includes("hurricane") || lower.includes("tropical storm") || lower.includes("tropical cyclone")) {
    return {
      level: "alert",
      headline: "Storm activity detected.",
      body: "Current storm data is showing tropical activity. Baja 411 will surface storm tools here so users can check conditions without leaving the app.",
    };
  }

  return {
    level: "monitor",
    headline: "Storm signal needs a closer look.",
    body: "The storm feed loaded, but Baja 411 could not confidently classify it. Treat conditions as worth monitoring until the next check.",
  };
}

export async function GET() {
  try {
    const response = await fetch("https://www.nhc.noaa.gov/widgets/nhc_widget.shtml", {
      cache: "no-store",
      headers: {
        "User-Agent": "Baja411 weather status checker",
      },
    });

    if (!response.ok) {
      throw new Error(`NHC widget returned ${response.status}`);
    }

    const html = await response.text();
    const text = stripHtml(html);
    const status = classifyStatus(text);

    return NextResponse.json({
      ...status,
      source: "National Hurricane Center",
      sourceUrl: "https://www.nhc.noaa.gov/cyclones/",
      checkedAt: new Date().toISOString(),
      excerpt: text.slice(0, 220),
    });
  } catch (error) {
    console.error("Storm status lookup failed", error);

    return NextResponse.json(
      {
        level: "monitor",
        headline: "Storm status is temporarily unavailable.",
        body: "Baja 411 could not refresh the storm signal. Keep monitoring conditions and try again shortly.",
        source: "National Hurricane Center",
        sourceUrl: "https://www.nhc.noaa.gov/cyclones/",
        checkedAt: new Date().toISOString(),
        excerpt: null,
      },
      { status: 200 },
    );
  }
}
