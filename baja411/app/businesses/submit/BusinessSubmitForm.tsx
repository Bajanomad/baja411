"use client";

import { useState } from "react";
import BusinessLocationPicker from "./BusinessLocationPicker";

const CATEGORIES = ["RESTAURANT", "BAR", "BAKERY", "BREWERY", "HOTEL", "RENTAL", "MECHANIC", "TIRE_SHOP", "FUEL", "MEDICAL", "DENTAL", "PHARMACY", "GROCERY", "OTHER"] as const;
const TOWNS = ["CERRITOS", "PESCADERO", "TODOS_SANTOS", "LA_PAZ", "CABO_SAN_LUCAS", "SAN_JOSE_DEL_CABO", "LORETO", "OTHER"] as const;

type FormState = { name: string; category: string; town: string; description: string; address: string; phone: string; website: string; lat: number | null; lng: number | null };
const initialState: FormState = { name: "", category: "", town: "", description: "", address: "", phone: "", website: "", lat: null, lng: null };

type LocationMode = "gps" | "map" | "unknown";

export default function BusinessSubmitForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [locationMode, setLocationMode] = useState<LocationMode>("unknown");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleUseCurrentLocation() {
    setLocationError(null);
    setLocationMessage(null);

    if (!("geolocation" in navigator)) {
      setLocationError("Location services are unavailable on this device. You can pick on map or add rough directions.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({ ...prev, lat: position.coords.latitude, lng: position.coords.longitude }));
        setLocationMode("gps");
        setLocationMessage("Location captured.");
      },
      () => {
        setLocationError("We could not access your location. You can pick on map or add rough directions instead.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/businesses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof payload.error === "string" ? payload.error : "Unable to submit right now.");
        return;
      }
      setSubmitted(true);
      setForm(initialState);
      setLocationMode("unknown");
      setLocationMessage(null);
      setLocationError(null);
    } catch {
      setError("Something went wrong while sending your suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) return <div className="rounded-2xl border border-jade/30 bg-jade/10 p-5"><h2 className="text-xl font-extrabold text-foreground">Submission received</h2><p className="mt-2 text-sm text-muted">Thanks. This listing is pending review before it appears publicly.</p></div>;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div><label htmlFor="name" className="mb-2 block text-sm font-bold text-foreground">Business name *</label><input id="name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="category" className="mb-2 block text-sm font-bold text-foreground">Category *</label><select id="category" required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm"><option value="">Select category</option>{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
        <div><label htmlFor="town" className="mb-2 block text-sm font-bold text-foreground">Town *</label><select id="town" required value={form.town} onChange={(e) => setForm((p) => ({ ...p, town: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm"><option value="">Select town</option>{TOWNS.map((town) => <option key={town} value={town}>{town}</option>)}</select></div>
      </div>
      <div><label htmlFor="description" className="mb-2 block text-sm font-bold text-foreground">Short description *</label><textarea id="description" required rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm" /></div>

      <section className="rounded-2xl border border-border bg-white p-4">
        <h3 className="text-base font-extrabold text-foreground">Location</h3>
        <p className="mt-1 text-xs text-muted">Choose the easiest way to share where this business is.</p>

        <div className="mt-4 grid gap-3">
          <button type="button" onClick={handleUseCurrentLocation} className="min-h-12 rounded-2xl border border-border bg-sand px-4 py-3 text-left text-sm font-bold text-foreground">Use my current location</button>

          <button type="button" onClick={() => setLocationMode("map")} className="min-h-12 rounded-2xl border border-border bg-sand px-4 py-3 text-left text-sm font-bold text-foreground">Pick location on map</button>

          <button type="button" onClick={() => { setLocationMode("unknown"); setForm((prev) => ({ ...prev, lat: null, lng: null })); setLocationMessage("You can share rough directions below."); }} className="min-h-12 rounded-2xl border border-border bg-sand px-4 py-3 text-left text-sm font-bold text-foreground">I do not know the exact location</button>
        </div>

        {locationMode === "map" && (
          <BusinessLocationPicker
            onConfirm={({ lat, lng }) => {
              setForm((prev) => ({ ...prev, lat, lng }));
              setLocationMessage("Location captured.");
              setLocationError(null);
            }}
          />
        )}

        <div className="mt-4"><label htmlFor="address" className="mb-2 block text-sm font-bold text-foreground">Address, area, landmark, or directions</label><input id="address" maxLength={500} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm" /><p className="mt-1 text-xs text-muted">Example: Near the Pemex in Todos Santos, across from the tire shop.</p></div>

        {locationMessage && <p className="mt-3 text-sm font-semibold text-jade">{locationMessage}</p>}
        {locationError && <p className="mt-3 text-sm font-semibold text-red-400">{locationError}</p>}
      </section>

      <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="phone" className="mb-2 block text-sm font-bold text-foreground">Phone</label><input id="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm" /></div><div><label htmlFor="website" className="mb-2 block text-sm font-bold text-foreground">Website</label><input id="website" placeholder="https://..." value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} className="min-h-12 w-full rounded-2xl border border-border bg-sand px-4 py-3 text-sm" /></div></div>
      {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="min-h-12 rounded-full bg-jade px-6 py-3 text-sm font-extrabold text-white disabled:opacity-70">{isSubmitting ? "Submitting..." : "Submit for review"}</button>
    </form>
  );
}
