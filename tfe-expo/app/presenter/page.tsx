"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = { id: string; session_number: number; title: string; subtitle: string; scheduled_time: string; duration_minutes: number; is_live: boolean; registrant_count: number };

export default function PresenterDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [presenterName, setPresenterName] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/presenter/sessions");
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setPresenterName(data.presenter?.full_name ?? "");
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading sessions...</div>;

  const totalRegistrants = sessions.reduce((sum, s) => sum + s.registrant_count, 0);
  const liveSessions = sessions.filter((s) => s.is_live);

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Welcome, {presenterName || "Presenter"}</h1>
      <p className="mt-1 text-sm text-slate-500">Your education sessions and registrants.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold">{sessions.length}</p>
          <p className="text-xs text-slate-500 mt-1">Sessions assigned</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{totalRegistrants}</p>
          <p className="text-xs text-slate-500 mt-1">Total registrants</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{liveSessions.length}</p>
          <p className="text-xs text-slate-500 mt-1">Live now</p>
        </div>
      </div>

      {/* Sessions */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Your Sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No sessions assigned to you yet. Contact the admin to be assigned as a presenter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold ${s.is_live ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {String(s.session_number).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    {s.subtitle && <p className="text-xs text-slate-500">{s.subtitle}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">{s.scheduled_time} · {s.duration_minutes} min · {s.registrant_count} registered</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.is_live && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live</span>}
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{s.registrant_count} registrants</span>
                  <button onClick={() => router.push(`/presenter/sessions/${s.id}`)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    View details
                  </button>
                  <a href={`/education/session?id=${s.id}`} target="_blank" rel="noopener noreferrer"
                    className="rounded-lg border border-purple-200 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
                    Present ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
