import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PinsAdmin from "./PinsAdmin";

export const metadata = { title: "Admin | Baja 411" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/signin");

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="label-tag mb-2 block">Admin</span>
        <h1 className="text-2xl font-extrabold text-foreground">Pin Moderation</h1>
        <p className="text-sm text-muted mt-1">Approve, reject, or delete community-submitted pins.</p>
      </div>
      <PinsAdmin />
    </div>
  );
}
