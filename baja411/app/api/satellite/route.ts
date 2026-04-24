import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "cdn.star.nesdis.noaa.gov",
  "www.nhc.noaa.gov",
  "www.ospo.noaa.gov",
];

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Fetch as if coming from NOAA's own site
        Referer: `https://${parsed.hostname}/`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return new NextResponse("Upstream error", { status: res.status });
    }

    const contentType = res.headers.get("content-type") ?? "image/gif";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
