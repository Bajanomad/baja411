import { NextResponse } from "next/server";

const FEEDS = [
  { label: "The Cabo Sun", icon: "☀️", color: "#E8956D", url: "https://thecabosun.com/feed" },
  { label: "Gringo Gazette", icon: "📰", color: "#2A7A5A", url: "https://www.gringogazette.com/feed" },
];

function extractText(xml: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(xml);
  if (cdata) return cdata[1].trim();
  const plain = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i").exec(xml);
  return plain ? plain[1].trim() : "";
}

function parseItems(xml: string, limit = 8) {
  const results: { title: string; link: string; pubDate: string }[] = [];
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  while ((m = itemRe.exec(xml)) !== null && results.length < limit) {
    const block = m[1];
    const title = extractText(block, "title");

    // <link> in RSS is often bare text between tags but can also be self-closing atom:link
    const linkMatch =
      /<link>([^<]+)<\/link>/i.exec(block) ??
      /<link[^>]+href="([^"]+)"/i.exec(block) ??
      /<guid[^>]*>([^<]+)<\/guid>/i.exec(block);
    const link = linkMatch?.[1]?.trim() ?? "";

    const pubDate = extractText(block, "pubDate");

    if (title && link) results.push({ title, link, pubDate });
  }

  return results;
}

export const revalidate = 900;

export async function GET() {
  const results = await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Baja411/1.0 (+https://baja411.com)" },
        });
        if (!res.ok) return { ...feed, articles: [], error: true };
        const xml = await res.text();
        return { ...feed, articles: parseItems(xml), error: false };
      } catch {
        return { ...feed, articles: [], error: true };
      }
    })
  );

  return NextResponse.json(results, {
    headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=1800" },
  });
}
