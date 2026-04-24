"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";

interface Article {
  title: string;
  link: string;
  pubDate: string;
}

interface FeedResult {
  label: string;
  icon: string;
  color: string;
  articles: Article[];
  error: boolean;
}

function formatDate(raw: string) {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function FeedSection({ label, icon, color, articles, error }: FeedResult) {
  return (
    <div>
      {/* Source heading */}
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b-2" style={{ borderColor: color }}>
        <span className="text-xl leading-none">{icon}</span>
        <h2 className="font-bold text-foreground text-lg">{label}</h2>
        {!error && (
          <span
            className="ml-auto flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider"
            style={{ color }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            Live
          </span>
        )}
      </div>

      {/* Articles */}
      {error && (
        <p className="text-muted text-sm py-6">Feed unavailable right now.</p>
      )}

      {!error && articles.length === 0 && (
        <p className="text-muted text-sm py-6">No articles found.</p>
      )}

      {!error && articles.length > 0 && (
        <ul className="space-y-0 divide-y divide-black/[0.06]">
          {articles.map((article, i) => (
            <li key={`${article.link}-${i}`}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-4 hover:pl-1 transition-all duration-150"
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
  );
}

function SkeletonSection() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b-2 border-black/10">
        <div className="w-6 h-6 bg-black/[0.06] rounded-full animate-pulse" />
        <div className="h-5 bg-black/[0.06] rounded-full w-36 animate-pulse" />
      </div>
      <div className="space-y-5 pt-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-3 space-y-2 border-b border-black/[0.06]">
            <div className="h-3.5 bg-black/[0.06] rounded-full w-full animate-pulse" />
            <div className="h-3.5 bg-black/[0.06] rounded-full w-3/4 animate-pulse" />
            <div className="h-2.5 bg-black/[0.04] rounded-full w-12 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [feeds, setFeeds] = useState<FeedResult[] | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then(setFeeds)
      .catch(() => setFeeds([]));
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
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-12">
            {feeds === null ? (
              <>
                <SkeletonSection />
                <SkeletonSection />
              </>
            ) : (
              feeds.map((feed) => (
                <FeedSection key={feed.label} {...feed} />
              ))
            )}
          </div>

          <p className="mt-12 text-xs text-muted text-center">
            Stories sourced from independent Baja media outlets. Baja 411 is not affiliated with any publisher.
          </p>
        </div>
      </div>
    </>
  );
}
