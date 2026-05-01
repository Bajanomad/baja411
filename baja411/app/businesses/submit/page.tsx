import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import BusinessSubmitForm from "./BusinessSubmitForm";

export const metadata: Metadata = {
  title: "Suggest a Business",
  description: "Suggest a local business for the Baja411 Local Directory.",
};

export default async function BusinessSubmitPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-sand px-5 py-24">
      <div className="mx-auto max-w-3xl">
        <span className="label-tag mb-4 block">Local directory</span>
        <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">Suggest a Business</h1>
        <p className="mt-3 text-sm text-muted md:text-base">
          Help improve Baja411 by sharing a useful local business. Submissions are reviewed before being published.
        </p>

        {!session?.user?.id ? (
          <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground">Sign in required</h2>
            <p className="mt-2 text-sm text-muted">
              Please sign in to suggest a business listing for the directory.
            </p>
            <Link
              href="/signin?callbackUrl=/businesses/submit"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-jade px-6 py-3 text-sm font-extrabold text-white"
            >
              Sign in to continue
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-border bg-white p-5 shadow-sm md:p-6">
            <BusinessSubmitForm />
          </div>
        )}
      </div>
    </div>
  );
}
