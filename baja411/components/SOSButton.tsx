import Link from "next/link";

export default function SOSButton() {
  return (
    <Link
      href="/emergency"
      aria-label="Open emergency contacts"
      className="fixed right-4 z-[100000] inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-red-600 text-sm font-extrabold tracking-wide text-white shadow-lg transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)",
      }}
    >
      SOS
    </Link>
  );
}
