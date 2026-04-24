"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";

interface Article {
  title: string;
  link: string;
  pubDate: string;
}

interface FeedConfig {
  label: string;
  icon: string;
  rssUrl: string;
  color: string;
}

const FEEDS: FeedConfig[] = [
  {
    label: "The Cabo Sun",
    icon: "☀️",
    rssUrl: "https://thecabosun.com/feed",
    color: "#E8956D",
  },
  {
    label: "Gringo Gazette",
    icon: "📰",
    rssUrl: "https://www.gringogazette.com/feed",
    color: "#2A7A5A",
  },
  {
    label: "La Paz Times",
    icon: "🌊",
    rssUrl: "https://lapaztimes.com/feed",
    color: "#2A7A5A",
  },
];

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function FeedWidget({ label, icon, rssUrl, color }: FeedConfig) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`;

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status !== "ok" || !Array.isArray(data.items)) {
          setError(true);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setArticles(
            (data.items as any[])
              .map((item) => ({
                title: item.title ?? "",
                link: item.link ?? "",
                pubDate: item.pubDate ?? "",
              }))
              .filter((a: Article) => a.title && a.link)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [rssUrl]);

  return (
    <div
      className="bg-white rounded-2xl border border-black/[0.07] shadow-sm flex flex-col overflow-hidden"
      style={{ borderTop: `3px solid ${color}` }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-black/[0.05]">
        <span className="text-2xl leading-none">{icon}</span>
        <h2 className="font-bold text-foreground text-base flex-1 leading-tight">
          {label}
        </h2>
        <span
          className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider"
          style={{ color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          Live
        </span>
      </div>

      {/* Article list */}
      <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
        {loading && (
          <div className="px-6 py-8 space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-black/[0.06] rounded-full w-full animate-pulse" />
                <div className="h-3 bg-black/[0.06] rounded-full w-4/5 animate-pulse" />
                <div className="h-2.5 bg-black/[0.04] rounded-full w-12 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="px-6 py-10 text-center">
            <p className="text-muted text-sm">Feed unavailable right now.</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-muted text-sm">No articles found.</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <ul className="divide-y divide-black/[0.05]">
            {articles.map((article, i) => (
              <li key={`${article.link}-${i}`}>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block px-6 py-4 hover:bg-black/[0.02] transition-colors"
                >
                  <p className="text-sm font-medium text-foreground leading-snug group-hover:text-jade transition-colors">
                    {article.title}
                  </p>
                  {article.pubDate && (
                    <span className="mt-1 text-xs text-muted block">
                      {formatDate(article.pubDate)}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1800&q=80&fit=crop&crop=center"
        alt="Colorful coastal town along the Baja California corridor at sunset"
        eyebrow="Baja California Sur"
        title="Local News"
        subtitle="Headlines from across the Baja corridor — updated throughout the day."
        pageBg="#FAFAF7"
      />

      <div className="bg-sand pb-16 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEEDS.map((feed) => (
              <FeedWidget key={feed.label} {...feed} />
            ))}
          </div>

          <p className="mt-10 text-xs text-muted text-center">
            Stories sourced from independent Baja media outlets. Baja 411 is not affiliated with any publisher.
          </p>
        </div>
      </div>
    </>
  );
}
