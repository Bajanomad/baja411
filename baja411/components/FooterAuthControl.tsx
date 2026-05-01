"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SessionResponse = {
  user?: { name?: string | null; email?: string | null } | null;
};

type CsrfResponse = {
  csrfToken?: string;
};

interface FooterAuthControlProps {
  className?: string;
}

export default function FooterAuthControl({ className = "" }: FooterAuthControlProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [callbackUrl, setCallbackUrl] = useState(pathname || "/");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCallbackUrl(`${window.location.pathname}${window.location.search}` || "/");
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data: SessionResponse | null) => {
        if (!mounted) return;
        setIsAuthenticated(Boolean(data?.user));
      })
      .catch(() => {
        if (!mounted) return;
        setIsAuthenticated(false);
      });

    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data: CsrfResponse) => {
        if (!mounted) return;
        setCsrfToken(data.csrfToken ?? "");
      })
      .catch(() => {
        if (!mounted) return;
        setCsrfToken("");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Link href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={className}>
        Sign In
      </Link>
    );
  }

  return (
    <form method="post" action="/api/auth/signout" className="m-0 inline-flex h-5 items-center p-0 leading-none">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <button type="submit" className={`${className} m-0 appearance-none border-0 bg-transparent p-0 font-inherit`}>
        Sign Out
      </button>
    </form>
  );
}
