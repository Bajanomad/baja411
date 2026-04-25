"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken ?? ""))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetch("/api/presignin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, optIn }),
      });

      const res = await fetch("/api/auth/signin/nodemailer", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, csrfToken, callbackUrl }).toString(),
        redirect: "manual",
      });

      if (res.ok || res.status === 302 || res.type === "opaqueredirect") {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=85&fit=crop&crop=center"
          alt=""
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.05)", transformOrigin: "center 55%" }}
        />
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(135deg, rgba(4,17,28,0.92) 0%, rgba(4,17,28,0.70) 50%, rgba(4,17,28,0.80) 100%)" }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(180deg, rgba(210,110,20,0.12) 0%, transparent 50%)" }}
      />
      <div
        className="absolute inset-0 z-[1] opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: "rgba(6,13,24,0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-5">📬</div>
              <h2 className="text-white font-extrabold text-2xl mb-3">Check your inbox</h2>
              <p className="text-white/55 text-sm leading-relaxed">
                We sent a sign-in link to{" "}
                <span className="text-white/80 font-medium">{email}</span>.<br />
                Click it to access your Baja 411 account.
              </p>
              <p className="text-white/30 text-xs mt-6">
                No email? Check spam or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="underline hover:text-white/60 transition-colors"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="text-center mb-7">
                <div className="text-4xl mb-2">🌊</div>
                <h1 className="text-white font-extrabold text-2xl tracking-tight">Baja 411</h1>
                <p className="text-white/35 text-xs mt-1 uppercase tracking-widest font-semibold">
                  Free · Community · Open
                </p>
              </div>

              {/* Tagline */}
              <div
                className="rounded-2xl px-5 py-4 mb-7 text-center"
                style={{ background: "rgba(42,122,90,0.15)", border: "1px solid rgba(42,122,90,0.25)" }}
              >
                <p className="text-white font-bold text-base leading-snug mb-2">
                  Know a great spot?<br />Let the community know.
                </p>
                <div className="flex items-center justify-center gap-4 text-white/40 text-xs">
                  <span>📍 Place pins</span>
                  <span>✏️ Edit spots</span>
                  <span>⭐ Rate places</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">
                    Your email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(42,122,90,0.7)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>

                {/* Opt-in */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={optIn}
                      onChange={(e) => setOptIn(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className="w-5 h-5 rounded-md border transition-all peer-checked:bg-jade peer-checked:border-jade"
                      style={{ background: optIn ? undefined : "rgba(255,255,255,0.07)", borderColor: optIn ? undefined : "rgba(255,255,255,0.20)" }}
                    />
                    {optIn && (
                      <svg className="absolute inset-0 m-auto w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-white/45 leading-relaxed group-hover:text-white/60 transition-colors">
                    Keep me posted on Baja 411 news, new features, and local updates.
                  </span>
                </label>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? "rgba(42,122,90,0.6)" : "linear-gradient(135deg, #2A7A5A 0%, #3D9970 100%)",
                    boxShadow: "0 4px 24px rgba(42,122,90,0.35)",
                  }}
                >
                  {loading ? "Sending…" : "Send me a sign-in link →"}
                </button>

                <p className="text-center text-white/25 text-xs">
                  No password needed — just click the link we email you.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          By signing in you agree to our community guidelines.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
