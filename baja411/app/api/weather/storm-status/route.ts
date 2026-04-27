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
      headline: "No tropical cyclones showing on the NHC widget.",
      body: "Current NHC widget text is not showing active tropical cyclones. Still check the source before travel, boating, or storm decisions.",
    };
  }

  if (lower.includes("hurricane") || lower.includes("tropical storm") || lower.includes("tropical cyclone")) {
    return {
      level: "alert",
      headline: "NHC widget is showing tropical activity.",
      body: "Open the official NHC source and check details before travel, driving, boating, or making safety decisions.",
    };
  }

  return {
    level: "monitor",
    headline: "Storm status needs source check.",
    body: "The NHC widget loaded, but Baja 411 could not confidently classify the text. Open the NHC source before making decisions.",
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
        headline: "Storm status source is unavailable.",
        body: "Baja 411 could not reach the NHC widget. Open the official NHC source before making weather decisions.",
        source: "National Hurricane Center",
        sourceUrl: "https://www.nhc.noaa.gov/cyclones/",
        checkedAt: new Date().toISOString(),
        excerpt: null,
      },
      { status: 200 },
    );
  }
}
