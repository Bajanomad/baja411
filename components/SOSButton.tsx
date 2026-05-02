import Link from "next/link";

export default function SOSButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/emergency"
      aria-label="Open emergency contacts"
      className={`inline-flex items-center justify-center rounded-full border-2 border-white bg-red-600 text-sm font-extrabold tracking-wide text-white shadow-lg transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 ${className}`}
    >
      SOS
    </Link>
  );
}
