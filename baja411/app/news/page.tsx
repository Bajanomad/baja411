"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";

interface Article {
  title: string;
  link: string;
  pubDate: string;
}

interface FeedState {
  loading: boolean;
  articles: Article[];
  error: boolean;
}

const FEEDS = [
  {
    name: "The Cabo Sun",
    apiUrl:
      "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fthecabosun.com%2Ffeed",
  },
  {
    name: "Gringo Gazette",
    apiUrl:
      "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.gringogazette.com%2Ffeed",
  },
  {
    name: "La Paz Times",
    apiUrl:
      "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Flapaztimes.com%2Ffeed",
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

function FeedWidget({ name, state }: { name: string; state: FeedState }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">{name}</h2>
      </div>

      {state.loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-6 h-6 border-2 border-jade border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted">Loading…</p>
        </div>
      )}

      {!state.loading && state.error && (
        <div className="py-10 px-5 text-center">
          <p className="text-xs text-muted">
            Couldn&apos;t load {name} right now — check back shortly.
          </p>
        </div>
      )}

      {!state.loading && !state.error && state.articles.length === 0 && (
        <div className="py-10 px-5 text-center">
          <p className="text-xs text-muted">No articles found.</p>
        </div>
      )}

      {!state.loading && state.articles.length > 0 && (
        <ul className="divide-y divide-border">
          {state.articles.map((article, i) => (
            <li key={`${article.link}-${i}`}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block px-5 py-3.5 hover:bg-sand/50 transition-colors"
              >
                <p className="text-sm text-foreground group-hover:text-jade leading-snug transition-colors">
                  {article.title}
                </p>
                {article.pubDate && (
                  <p className="text-xs text-muted mt-1">
                    {formatDate(article.pubDate)}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NewsPage() {
  const [feedStates, setFeedStates] = useState<FeedState[]>(
    FEEDS.map(() => ({ loading: true, articles: [], error: false }))
  );

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled(
      FEEDS.map((feed) =>
        fetch(feed.apiUrl)
          .then((res) => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
          })
          .then((data) => {
            if (data.status !== "ok" || !Array.isArray(data.items)) return [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return data.items.slice(0, 8).map((item: any) => ({
              title: item.title ?? "",
              link: item.link ?? "",
              pubDate: item.pubDate ?? "",
            })) as Article[];
          })
      )
    ).then((results) => {
      if (cancelled) return;
      setFeedStates(
        results.map((result) => {
          if (result.status === "fulfilled") {
            return { loading: false, articles: result.value.filter((a) => a.title && a.link), error: false };
          }
          return { loading: false, articles: [], error: true };
        })
      );
    });

    return () => {
      cancelled = true;
    };
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEEDS.map((feed, i) => (
              <FeedWidget key={feed.name} name={feed.name} state={feedStates[i]} />
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
