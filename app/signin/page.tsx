"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  const cardRef = useRef<HTMLElement | null>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken ?? ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!submitted) return;

    const frame = requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      confirmationHeadingRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [submitted]);

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
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-[#05111d] text-white px-4 pb-10 pt-[calc(var(--nav-height)+1.5rem)] sm:pb-12 sm:pt-[calc(var(--nav-height)+2rem)]">
      <div className="mx-auto w-full max-w-md">
        <section
          ref={cardRef}
          className="rounded-3xl border border-white/15 bg-[#0a1d2f]/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.5)] sm:p-7"
        >
          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jade/20 text-2xl" aria-hidden>
                📬
              </div>
              <div className="space-y-2">
                <h1 ref={confirmationHeadingRef} tabIndex={-1} className="text-2xl font-extrabold tracking-tight">
                  Check your inbox
                </h1>
                <p className="text-sm leading-relaxed text-white/80">
                  We sent a secure sign in link to the email address you entered.
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  Open the email on this device, then tap the link to continue.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 px-4 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Try another email
              </button>
            </div>
          ) : (
            <>
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-jade/35 bg-jade/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-jade-light">
                  <span aria-hidden>🧭</span>
                  Baja411
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold tracking-tight">Sign in to Baja411</h1>
                  <p className="text-sm leading-relaxed text-white/80">
                    Add pins, contribute local intel, and help keep Baja useful.
                  </p>
                </div>
                <p className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/85">
                  No password needed. Enter your email and we will send you a secure sign in link.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signin-email" className="block text-sm font-semibold text-white/95">
                    Email address
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-white/25 bg-[#071424] px-4 text-base text-white placeholder:text-white/45 outline-none transition focus:border-jade-light focus:ring-2 focus:ring-jade/30"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <input
                    type="checkbox"
                    checked={optIn}
                    onChange={(e) => setOptIn(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-white/30 bg-transparent text-jade focus:ring-2 focus:ring-jade/40"
                  />
                  <span className="text-sm leading-relaxed text-white/80">
                    Send me Baja411 updates and local feature news.
                  </span>
                </label>

                {error && (
                  <p className="rounded-xl border border-red-300/30 bg-red-500/12 px-3 py-2 text-sm text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="min-h-12 w-full rounded-xl bg-gradient-to-r from-jade to-jade-light px-4 text-base font-bold text-white shadow-[0_8px_28px_rgba(42,122,90,0.4)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? "Sending sign in link…" : "Send sign in link"}
                </button>

                <p className="text-center text-sm text-white/75">
                  We only use this to sign you in and manage your Baja411 account.
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
