"use client";

import { useState, useEffect } from "react";

interface UserRow {
  email: string;
  marketingOptIn: boolean;
  createdAt: string;
}

export default function EmailsAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const optedIn = users.filter((u) => u.marketingOptIn);

  function copyEmails() {
    const text = optedIn.map((u) => u.email).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadCsv() {
    const rows = ["email,joined", ...optedIn.map((u) => `${u.email},${new Date(u.createdAt).toLocaleDateString()}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baja411-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {loading ? (
        <div className="text-center py-10 text-muted text-sm">Loading…</div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="bg-white border border-border rounded-xl px-4 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-extrabold text-foreground">{optedIn.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Opted in</div>
            </div>
            <div className="bg-white border border-border rounded-xl px-4 py-3 text-center min-w-[90px]">
              <div className="text-2xl font-extrabold text-foreground">{users.length}</div>
              <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Total users</div>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={copyEmails}
                disabled={optedIn.length === 0}
                className="px-4 py-2 rounded-xl bg-jade text-white text-xs font-bold hover:bg-jade-light transition-colors disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy emails"}
              </button>
              <button
                onClick={downloadCsv}
                disabled={optedIn.length === 0}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted hover:text-foreground transition-colors disabled:opacity-40"
              >
                Download CSV
              </button>
            </div>
          </div>

          {optedIn.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">No opted-in subscribers yet.</div>
          ) : (
            <div className="space-y-2">
              {optedIn.map((u) => (
                <div key={u.email} className="bg-white rounded-xl border border-border px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{u.email}</span>
                  <span className="text-[11px] text-muted flex-shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
