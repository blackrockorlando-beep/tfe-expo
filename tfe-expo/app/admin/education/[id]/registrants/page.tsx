"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Buyer = { id: string; full_name: string; email: string; phone: string | null; state: string; ownership_model: string | null; investment_range: number | null };
type Registrant = { status: string; attended: boolean; created_at: string; buyers: Buyer };
type Session = { id: string; title: string; session_number: number; scheduled_time: string; duration_minutes: number; presenters: { full_name: string } | null };

export default function SessionRegistrantsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [stats, setStats] = useState({ total: 0, registered: 0, attended: 0 });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/education/${sessionId}/registrants`);
      const data = await res.json();
      setSession(data.session);
      setRegistrants(data.registrants ?? []);
      setStats(data.stats ?? { total: 0, registered: 0, attended: 0 });
      setLoading(false);
    }
    load();
  }, [sessionId]);

  async function toggleAttendance(buyerId: string, currentAttended: boolean) {
    await fetch(`/api/admin/education/${sessionId}/registrants`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, attended: !currentAttended }),
    });
    setRegistrants((prev) =>
      prev.map((r) =>
        r.buyers.id === buyerId ? { ...r, attended: !currentAttended } : r
      )
    );
    setStats((prev) => ({
      ...prev,
      attended: prev.attended + (currentAttended ? -1 : 1),
    }));
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading registrants...</div>;

  return (
    <div className="px-8 py-8">
      <button onClick={() => router.push(`/admin/education/${sessionId}`)} className="text-xs text-slate-400 hover:text-slate-600">← Back to session</button>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Session Registrants</h1>
          {session && (
            <p className="mt-1 text-sm text-slate-500">
              {session.title} · {session.scheduled_time} · {session.duration_minutes} min
              {session.presenters ? ` · ${session.presenters.full_name}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Total registered</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.attended}</p>
          <p className="text-xs text-slate-500 mt-1">Attended</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-slate-400">{stats.total - stats.attended}</p>
          <p className="text-xs text-slate-500 mt-1">Not yet attended</p>
        </div>
      </div>

      {/* Registrant list */}
      <div className="mt-6">
        {registrants.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No one has registered for this session yet.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">State</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Model</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Registered</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">Attended</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrants.map((r) => (
                  <tr key={r.buyers.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium">{r.buyers.full_name}</td>
                    <td className="px-5 py-3 text-slate-600">{r.buyers.email}</td>
                    <td className="px-5 py-3 text-slate-600">{r.buyers.phone ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{r.buyers.state}</td>
                    <td className="px-5 py-3 text-slate-600">{r.buyers.ownership_model ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{r.buyers.investment_range ? `$${r.buyers.investment_range}K` : "—"}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleAttendance(r.buyers.id, r.attended)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          r.attended
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        {r.attended ? "✓ Attended" : "Mark attended"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
