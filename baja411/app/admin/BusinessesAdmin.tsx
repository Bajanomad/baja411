"use client";

import { useCallback, useEffect, useState } from "react";

interface Business {
  id: string;
  name: string;
  category: string;
  town: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  photos: string[];
  lat?: number | null;
  lng?: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  lastVerified?: string | null;
  author?: { name?: string | null; email?: string | null } | null;
}

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED"] as const;
const CATEGORIES = ["RESTAURANT", "BAR", "BAKERY", "BREWERY", "HOTEL", "RENTAL", "MECHANIC", "TIRE_SHOP", "FUEL", "MEDICAL", "DENTAL", "PHARMACY", "GROCERY", "OTHER"];
const TOWNS = ["CERRITOS", "PESCADERO", "TODOS_SANTOS", "LA_PAZ", "CABO_SAN_LUCAS", "SAN_JOSE_DEL_CABO", "LORETO", "OTHER"];

export default function BusinessesAdmin() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tab, setTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, Partial<Business>>>({});
  const [openEditor, setOpenEditor] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/businesses")
      .then((r) => r.json())
      .then((data) => {
        setBusinesses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function patchBusiness(id: string, payload: Record<string, unknown>) {
    setWorking(id);
    const res = await fetch("/api/admin/businesses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBusinesses((curr) => curr.map((b) => (b.id === id ? updated : b)));
    }
    setWorking(null);
  }

  async function approve(id: string) { await patchBusiness(id, { status: "APPROVED" }); }
  async function reject(id: string) { await patchBusiness(id, { status: "REJECTED" }); }

  async function remove(id: string) {
    if (!confirm("Delete this business permanently?")) return;
    setWorking(id);
    const res = await fetch("/api/admin/businesses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setBusinesses((curr) => curr.filter((b) => b.id !== id));
    setWorking(null);
  }

  function beginEdit(business: Business) {
    setOpenEditor((curr) => (curr === business.id ? null : business.id));
    setEditing((curr) => ({
      ...curr,
      [business.id]: {
        name: business.name,
        category: business.category,
        town: business.town,
        address: business.address ?? "",
        phone: business.phone ?? "",
        website: business.website ?? "",
        description: business.description ?? "",
        lat: business.lat ?? "",
        lng: business.lng ?? "",
        status: business.status,
        lastVerified: business.lastVerified ? business.lastVerified.slice(0, 10) : "",
      },
    }));
  }

  async function saveEdit(id: string) {
    const form = editing[id];
    if (!form) return;
    await patchBusiness(id, {
      name: form.name,
      category: form.category,
      town: form.town,
      address: form.address || null,
      phone: form.phone || null,
      website: form.website || null,
      description: form.description || null,
      lat: form.lat === "" ? null : Number(form.lat),
      lng: form.lng === "" ? null : Number(form.lng),
      status: form.status,
      lastVerified: form.lastVerified || null,
    });
    setOpenEditor(null);
  }

  const filtered = businesses.filter((b) => b.status === tab);
  const counts = {
    PENDING: businesses.filter((b) => b.status === "PENDING").length,
    APPROVED: businesses.filter((b) => b.status === "APPROVED").length,
    REJECTED: businesses.filter((b) => b.status === "REJECTED").length,
  };

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
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

      {loading ? <div className="text-center py-16 text-muted text-sm">Loading…</div> : (
        filtered.length === 0 ? <div className="text-center py-16 text-muted text-sm">No {tab.toLowerCase()} businesses.</div> : (
          <div className="space-y-3">
            {filtered.map((business) => {
              const form = editing[business.id] ?? {};
              return (
                <div key={business.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-foreground text-sm truncate">{business.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-sand px-2 py-0.5 rounded-full border border-border">{business.category.replaceAll("_", " ")}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-sand px-2 py-0.5 rounded-full border border-border">{business.town.replaceAll("_", " ")}</span>
                      </div>
                      {business.address && <p className="text-xs text-muted">📍 {business.address}</p>}
                      {business.phone && <p className="text-xs text-muted">📞 {business.phone}</p>}
                      {business.website && <p className="text-xs text-muted">🔗 {business.website}</p>}
                      {business.description && <p className="text-xs text-muted mt-2 leading-relaxed">{business.description}</p>}
                      <div className="text-[10px] text-muted/60 flex gap-3 flex-wrap mt-2">
                        {(business.lat !== null && business.lat !== undefined && business.lng !== null && business.lng !== undefined) && (
                          <span>🧭 {business.lat.toFixed(4)}, {business.lng.toFixed(4)}</span>
                        )}
                        <span>👤 {business.author?.name ?? business.author?.email ?? "Unknown"}</span>
                        <span>🕐 Created {new Date(business.createdAt).toLocaleDateString()}</span>
                        {business.lastVerified && <span>✔ Last verified {new Date(business.lastVerified).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 flex-shrink-0 justify-end">
                      {business.status !== "APPROVED" && <button onClick={() => approve(business.id)} disabled={working === business.id} className="px-3 py-2 rounded-lg bg-jade text-white text-xs font-bold hover:bg-jade-light disabled:opacity-50">Approve</button>}
                      {business.status !== "REJECTED" && <button onClick={() => reject(business.id)} disabled={working === business.id} className="px-3 py-2 rounded-lg border border-border text-xs font-bold text-muted hover:text-foreground disabled:opacity-50">Reject</button>}
                      <button onClick={() => beginEdit(business)} disabled={working === business.id} className="px-3 py-2 rounded-lg border border-border text-xs font-bold text-muted hover:text-foreground disabled:opacity-50">Edit</button>
                      <button onClick={() => remove(business.id)} disabled={working === business.id} className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 disabled:opacity-50">Delete</button>
                    </div>
                  </div>

                  {openEditor === business.id && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border">
                      <input className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.name as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], name: e.target.value } }))} placeholder="Name" />
                      <select className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.category as string) ?? "OTHER"} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], category: e.target.value } }))}>{CATEGORIES.map((c) => <option key={c} value={c}>{c.replaceAll("_", " ")}</option>)}</select>
                      <select className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.town as string) ?? "OTHER"} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], town: e.target.value } }))}>{TOWNS.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}</select>
                      <input className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.phone as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], phone: e.target.value } }))} placeholder="Phone" />
                      <input className="border border-border rounded-lg px-3 py-2 text-xs sm:col-span-2" value={(form.address as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], address: e.target.value } }))} placeholder="Address" />
                      <input className="border border-border rounded-lg px-3 py-2 text-xs sm:col-span-2" value={(form.website as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], website: e.target.value } }))} placeholder="Website" />
                      <textarea className="border border-border rounded-lg px-3 py-2 text-xs sm:col-span-2" rows={3} value={(form.description as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], description: e.target.value } }))} placeholder="Description" />
                      <input className="border border-border rounded-lg px-3 py-2 text-xs" value={form.lat as string | number | undefined ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], lat: e.target.value } }))} placeholder="Latitude" />
                      <input className="border border-border rounded-lg px-3 py-2 text-xs" value={form.lng as string | number | undefined ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], lng: e.target.value } }))} placeholder="Longitude" />
                      <select className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.status as string) ?? business.status} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], status: e.target.value } }))}>
                        {STATUS_TABS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="date" className="border border-border rounded-lg px-3 py-2 text-xs" value={(form.lastVerified as string) ?? ""} onChange={(e) => setEditing((c) => ({ ...c, [business.id]: { ...c[business.id], lastVerified: e.target.value } }))} />
                      <div className="sm:col-span-2 flex justify-end">
                        <button onClick={() => saveEdit(business.id)} disabled={working === business.id} className="px-4 py-2 rounded-lg bg-jade text-white text-xs font-bold hover:bg-jade-light disabled:opacity-50">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
