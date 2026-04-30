import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "cdn.star.nesdis.noaa.gov",
  "www.nhc.noaa.gov",
  "www.ospo.noaa.gov",
];

const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_PATH_PATTERNS: Record<string, RegExp[]> = {
  "cdn.star.nesdis.noaa.gov": [
    /^\/GOES19\/ABI\/SECTOR\/(mex|eep)\/(13|GEOCOLOR)\/GOES19-(MEX|EEP)-(13|GEOCOLOR)-\d+x\d+\.gif$/i,
  ],
  "www.nhc.noaa.gov": [
    /^\/widgets\/[a-z0-9._/-]+\.(gif|png|jpe?g|webp)$/i,
    /^\/xgtwo\/[a-z0-9._/-]+\.(gif|png|jpe?g|webp)$/i,
  ],
  "www.ospo.noaa.gov": [
    /^\/[a-z0-9._/-]+\.(gif|png|jpe?g|webp)$/i,
  ],
};

export const revalidate = 600;

function isPathAllowed(hostname: string, pathname: string) {
  const patterns = ALLOWED_PATH_PATTERNS[hostname];
  if (!patterns) return false;
  return patterns.some((pattern) => pattern.test(pathname));
}

function isAllowedImageContentType(contentType: string | null) {
  if (!contentType) return false;
  const normalized = contentType.split(";")[0].trim().toLowerCase();
  return ALLOWED_IMAGE_CONTENT_TYPES.has(normalized);
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) return new NextResponse("Invalid satellite request", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid satellite request", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new NextResponse("Satellite source not allowed", { status: 403 });
  }

  if (!isPathAllowed(parsed.hostname, parsed.pathname)) {
    return new NextResponse("Satellite source not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        Referer: `https://${parsed.hostname}/`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    if (!upstream.ok) {
      return new NextResponse("Satellite image unavailable", { status: 502 });
    }

    if (!isAllowedImageContentType(upstream.headers.get("content-type"))) {
      return new NextResponse("Satellite image unavailable", { status: 502 });
    }

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) {
      const bytes = Number.parseInt(contentLength, 10);
      if (Number.isFinite(bytes) && bytes > MAX_IMAGE_BYTES) {
        return new NextResponse("Satellite image too large", { status: 413 });
      }
    }

    const body = await upstream.arrayBuffer();
    if (body.byteLength > MAX_IMAGE_BYTES) {
      return new NextResponse("Satellite image too large", { status: 413 });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/gif",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Satellite proxy fetch failed", error);
    return new NextResponse("Satellite image unavailable", { status: 502 });
  }
}
