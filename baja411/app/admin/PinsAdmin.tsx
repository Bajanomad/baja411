"use client";

import { useState, useEffect, useCallback } from "react";

const CATEGORY_EMOJI: Record<string, string> = {
  BOONDOCKING: "🏕️", BEACH: "🏖️", WATER_FILL: "💧", DUMP_STATION: "🚽",
  MECHANIC: "🔧", FUEL: "⛽", TRAILHEAD: "🥾", FISHING: "🎣", MARKET: "🛒", OTHER: "📍",
};

interface Pin {
  id: string;
  title: string;
  description?: string | null;
  lat: number;
  lng: number;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  author?: { name?: string | null; email?: string | null } | null;
}

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function PinsAdmin() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [tab, setTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/pins")
      .then((r) => r.json())
      .then((data) => { setPins(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function approve(id: string) {
    setWorking(id);
    await fetch("/api/admin/pins", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "APPROVED" }) });
    setPins((p) => p.map((pin) => pin.id === id ? { ...pin, status: "APPROVED" } : pin));
    setWorking(null);
  }

  async function reject(id: string) {
    setWorking(id);
    await fetch("/api/admin/pins", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "REJECTED" }) });
    setPins((p) => p.map((pin) => pin.id === id ? { ...pin, status: "REJECTED" } : pin));
    setWorking(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this pin permanently?")) return;
    setWorking(id);
    await fetch("/api/admin/pins", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPins((p) => p.filter((pin) => pin.id !== id));
    setWorking(null);
  }

  const filtered = pins.filter((p) => p.status === tab);
  const counts = { PENDING: pins.filter((p) => p.status === "PENDING").length, APPROVED: pins.filter((p) => p.status === "APPROVED").length, REJECTED: pins.filter((p) => p.status === "REJECTED").length };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${tab === t ? "bg-jade text-white" : "bg-white border border-border text-muted hover:border-jade/40"}`}
          >
            {t === "PENDING" ? "⏳" : t === "APPROVED" ? "✅" : "❌"} {t} {counts[t] > 0 && <span className="ml-1 opacity-70">({counts[t]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No {tab.toLowerCase()} pins.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pin) => (
            <div key={pin.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm">{CATEGORY_EMOJI[pin.category] ?? "📍"}</span>
                    <span className="font-bold text-foreground text-sm truncate">{pin.title}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-sand px-2 py-0.5 rounded-full border border-border">{pin.category.replace("_", " ")}</span>
                  </div>
                  {pin.description && (
                    <p className="text-xs text-muted mb-2 leading-relaxed">{pin.description}</p>
                  )}
                  <div className="text-[10px] text-muted/60 flex gap-3 flex-wrap">
                    <span>📍 {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
                    <span>👤 {pin.author?.name ?? pin.author?.email ?? "Unknown"}</span>
                    <span>🕐 {new Date(pin.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {pin.status !== "APPROVED" && (
                    <button
                      onClick={() => approve(pin.id)}
                      disabled={working === pin.id}
                      className="px-3 py-1.5 rounded-lg bg-jade text-white text-xs font-bold hover:bg-jade-light transition-colors disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {pin.status !== "REJECTED" && (
                    <button
                      onClick={() => reject(pin.id)}
                      disabled={working === pin.id}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-muted hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <button
                    onClick={() => remove(pin.id)}
                    disabled={working === pin.id}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
