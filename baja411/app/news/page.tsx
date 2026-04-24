"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

interface Feed {
  label: string;
  url: string;
}

const FEEDS: Feed[] = [
  {
    label: "Mexico News Daily",
    url: "https://mexiconewsdaily.com/feed/",
  },
  {
    label: "Gringo Gazette",
    url: "https://www.gringogazette.com/feed/",
  },
  {
    label: "The Baja Nomad",
    url: "https://www.thebajanomad.com/feed/",
  },
];

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").slice(0, 160).trim();
}

async function fetchFeed(feed: Feed): Promise<Article[]> {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=5`;
  const res = await fetch(apiUrl, { next: { revalidate: 900 } });
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.items.map((item: any) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    pubDate: item.pubDate ?? "",
    description: item.description ? stripHtml(item.description) : "",
    source: feed.label,
  }));
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(FEEDS.map(fetchFeed))
      .then((results) => {
        if (cancelled) return;
        const all = results
          .flat()
          .filter((a) => a.title && a.link)
          .sort(
            (a, b) =>
              new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );
        setArticles(all);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

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
        <div className="max-w-4xl mx-auto">

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-jade border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted text-sm">Loading latest headlines…</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-muted text-sm">
                Couldn&apos;t load news right now — check back shortly.
              </p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-sm">No articles found at this time.</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {articles.map((article, i) => (
                <a
                  key={`${article.link}-${i}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-border shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="label-tag text-[10px]">{article.source}</span>
                    {article.pubDate && (
                      <span className="text-xs text-muted">
                        {formatDate(article.pubDate)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-foreground text-sm leading-snug mb-2 group-hover:text-jade transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 flex-1">
                      {article.description}
                    </p>
                  )}
                  <span className="mt-4 text-xs font-semibold text-jade flex items-center gap-1">
                    Read more
                    <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </a>
              ))}
            </div>
          )}

          <p className="mt-10 text-xs text-muted text-center">
            Stories sourced from independent Baja media outlets. Baja 411 is not affiliated with any publisher.
          </p>
        </div>
      </div>
    </>
  );
}
