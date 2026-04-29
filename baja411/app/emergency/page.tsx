type EmergencyContact = {
  name: string;
  phone: string;
  useFor: string;
  availability: string;
  sourceLabel: string;
};

const emergencyContacts: EmergencyContact[] = [
  {
    name: "Emergency Services",
    phone: "911",
    useFor: "medical emergencies, police, fire, civil protection, immediate danger",
    availability: "24/7",
    sourceLabel: "Gobierno de México / 911",
  },
  {
    name: "Ángeles Verdes Roadside Assistance",
    phone: "078",
    useFor: "roadside tourist assistance and mechanical help",
    availability: "8:00 to 20:00, 365 days",
    sourceLabel: "Gobierno de México / Ángeles Verdes",
  },
  {
    name: "CFE Electrical Outage / Power Failure",
    phone: "071",
    useFor: "electrical outages, voltage problems, power service failures",
    availability: "24/7",
    sourceLabel: "CFE / Gobierno de México",
  },
];

const placeholders = [
  {
    title: "Medical Help",
    body: "Verified hospitals and clinics coming soon",
  },
  {
    title: "Roadside Help",
    body: "Verified tow trucks coming soon",
  },
  {
    title: "Storm / Hurricane Help",
    body: "Local civil protection and shelter contacts are being verified",
  },
  {
    title: "Local BCS Contacts",
    body: "Municipal contacts by town coming soon after verification",
  },
];

export default function EmergencyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-24">
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Emergency Contacts</h1>
        <p className="mt-3 text-sm font-bold text-red-700 sm:text-base">
          For life threatening emergencies, call 911 first.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {emergencyContacts.map((contact) => (
          <article key={contact.name} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-night">{contact.name}</h2>
            <p className="mt-3 text-sm">
              <span className="font-bold">Phone:</span> {contact.phone}
            </p>
            <p className="mt-2 text-sm text-foreground/85">
              <span className="font-bold text-foreground">Use for:</span> {contact.useFor}
            </p>
            <p className="mt-2 text-sm text-foreground/85">
              <span className="font-bold text-foreground">Availability:</span> {contact.availability}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Source: {contact.sourceLabel}</p>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-night">More emergency resources</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {placeholders.map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-sand p-4">
              <h3 className="text-sm font-extrabold text-night">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
