import { listings } from '../data/seed'
export function DirectoryPage(){return <main><h2>Directory</h2><p>Verified first, practical info only.</p><ul>{listings.map((l)=><li key={l.name}><strong>{l.name}</strong> · {l.category} · {l.verified?'Verified':'Pending verification'}</li>)}</ul></main>}
