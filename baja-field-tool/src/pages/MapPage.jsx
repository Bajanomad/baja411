import { useMemo, useState } from 'react'
import { listings } from '../data/seed'

const fallback = { lat: 23.061, lon: -109.701 }

export function MapPage() {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => listings.filter((l) => `${l.name} ${l.category} ${l.town}`.toLowerCase().includes(q.toLowerCase())), [q])
  return <main><h2>Map-first field utility</h2><p>GPS denied fallback: {fallback.lat}, {fallback.lon}</p><input placeholder='Search town, service, business' value={q} onChange={(e)=>setQ(e.target.value)} />
  <ul>{filtered.map((f)=><li key={f.name}>{f.name} — {f.category} ({f.town})</li>)}</ul></main>
}
