"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  session_number: number;
  title: string;
  scheduled_time: string;
  duration_minutes: number;
  is_live: boolean;
  display_order: number;
  presenters: { full_name: string; initials: string } | null;
};

export default function AdminEducationPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This will also delete all slides, questions, and resources.`)) return;
    await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Education Sessions</h1>
        <button onClick={() => router.push("/admin/education/new")}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
          + New session
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-slate-400">No education sessions yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${s.is_live ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {String(s.session_number).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-slate-500">
                      {s.scheduled_time} · {s.duration_minutes} min
                      {s.presenters ? ` · ${s.presenters.full_name}` : ""}
                      {s.is_live ? " · 🟢 Live" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                <button onClick={() => router.push(`/admin/education/${s.id}/registrants`)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50">
                    Registrants
                  </button>
                  <button onClick={() => router.push(`/admin/education/${s.id}`)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(s.id, s.title)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
