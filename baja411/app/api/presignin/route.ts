import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_CONTENT_LENGTH = 2_048;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_REGEX = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

type RateEntry = { count: number; resetAt: number };

const globalForRateLimit = globalThis as typeof globalThis & {
  presigninRateLimit?: Map<string, RateEntry>;
};

const presigninRateLimit = globalForRateLimit.presigninRateLimit ?? new Map<string, RateEntry>();
globalForRateLimit.presigninRateLimit = presigninRateLimit;

function getClientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown-ip";
  const userAgent = (req.headers.get("user-agent") ?? "unknown-ua").slice(0, 200);
  return `${ip}|${userAgent}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();

  for (const [entryKey, entry] of presigninRateLimit) {
    if (entry.resetAt <= now) presigninRateLimit.delete(entryKey);
  }

  const current = presigninRateLimit.get(key);
  if (!current || current.resetAt <= now) {
    presigninRateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_ATTEMPTS) return true;

  current.count += 1;
  presigninRateLimit.set(key, current);
  return false;
}

function invalidRequest() {
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (isRateLimited(getClientKey(req))) {
    return NextResponse.json({ error: "Please try again later" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalidRequest();
  }

  if (!body || typeof body !== "object") {
    return invalidRequest();
  }

  const { email, optIn } = body as Record<string, unknown>;
  if (typeof email !== "string") {
    return invalidRequest();
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (
    !normalizedEmail ||
    normalizedEmail.length > MAX_EMAIL_LENGTH ||
    !EMAIL_REGEX.test(normalizedEmail)
  ) {
    return invalidRequest();
  }

  if (optIn !== undefined && typeof optIn !== "boolean") {
    return invalidRequest();
  }

  await db.pendingOptIn.upsert({
    where: { email: normalizedEmail },
    create: {
      email: normalizedEmail,
      optIn: Boolean(optIn),
      expiresAt: new Date(Date.now() + 3_600_000),
    },
    update: {
      optIn: Boolean(optIn),
      expiresAt: new Date(Date.now() + 3_600_000),
    },
  });

  return NextResponse.json({ ok: true });
}
