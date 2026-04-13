"use client";

import { useEffect, useState } from "react";

type Buyer = { id: string; full_name: string; email: string; phone: string | null; state: string; ownership_model?: string; investment_range?: number; decision_timeline?: string };
type Lead = { status: string; updated_at: string; buyers: Buyer };
type SavedLead = { created_at: string; buyers: Buyer };
type ViewLead = { created_at: string; buyers: Buyer };
type SpeedConnect = { id: string; title: string; scheduled_at: string; status: string; duration_minutes: number; buyers: Buyer };
type Stats = {
  interestedCount: number; notInterestedCount: number; savedCount: number;
  totalPavilionViews: number; uniquePavilionViewers: number;
  speedConnectRequests: number; speedConnectScheduled: number; speedConnectCompleted: number; speedConnectCancelled: number;
  adminIncluded: number; adminExcluded: number;
  sessionSignups: number; sessionAttended: number;
  totalRegisteredBuyers: number;
};

export default function FranchisorLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState("");
  const [tier, setTier] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "interested" | "saved" | "views" | "connects">("overview");
  const [interested, setInterested] = useState<Lead[]>([]);
  const [saved, setSaved] = useState<SavedLead[]>([]);
  const [views, setViews] = useState<ViewLead[]>([]);
  const [speedConnects, setSpeedConnects] = useState<SpeedConnect[]>([]);
  const [stats, setStats] = useState<Stats>({
    interestedCount: 0, notInterestedCount: 0, savedCount: 0,
    totalPavilionViews: 0, uniquePavilionViewers: 0,
    speedConnectRequests: 0, speedConnectScheduled: 0, speedConnectCompleted: 0, speedConnectCancelled: 0,
    adminIncluded: 0, adminExcluded: 0,
    sessionSignups: 0, sessionAttended: 0,
    totalRegisteredBuyers: 0,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/franchisor/leads");
      const data = await res.json();
      setBrandName(data.brand?.name ?? "");
      setTier(data.brand?.exhibitor_tier ?? "exhibitor");
      setInterested(data.interested ?? []);
      setSaved(data.saved ?? []);
      setViews(data.views ?? []);
      setSpeedConnects(data.speedConnects ?? []);
      setStats(data.stats ?? {});
      setLoading(false);
    }
    load();
  }, []);

  const tierLabel = tier === "title_sponsor" ? "Title Sponsor" : tier === "featured" ? "Featured" : "Exhibitor";
  const tierColor = tier === "title_sponsor" ? "#854F0B" : tier === "featured" ? "#3C3489" : "#5F5E5A";
  const tierBg = tier === "title_sponsor" ? "#FAEEDA" : tier === "featured" ? "#EEEDFE" : "#F1EFE8";

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading dashboard...</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{brandName} — Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Your brand performance and buyer engagement.</p>
        </div>
        <span style={{ background: tierBg, color: tierColor, fontSize: 12, padding: "4px 12px", borderRadius: 12, fontWeight: 600 }}>{tierLabel}</span>
      </div>

      {/* Key metrics — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.interestedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Interested</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-amber-500">{stats.savedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Saved / bookmarked</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalPavilionViews}</p>
          <p className="text-xs text-slate-500 mt-1">Pavilion views</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.speedConnectRequests}</p>
          <p className="text-xs text-slate-500 mt-1">Speed connects</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{stats.notInterestedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Not interested</p>
        </div>
      </div>

      {/* Secondary metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Unique viewers</span>
            <span className="text-lg font-bold">{stats.uniquePavilionViewers}</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Connects scheduled</span>
            <span className="text-lg font-bold text-emerald-600">{stats.speedConnectScheduled}</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Connects completed</span>
            <span className="text-lg font-bold">{stats.speedConnectCompleted}</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Connects cancelled</span>
            <span className="text-lg font-bold text-slate-400">{stats.speedConnectCancelled}</span>
          </div>
        </div>
      </div>

      {/* Admin match info + session stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold mb-3">Match distribution</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Admin included (force-matched)</span>
              <span className="font-semibold">{stats.adminIncluded}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Admin excluded (force-removed)</span>
              <span className="font-semibold">{stats.adminExcluded}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total registered buyers at expo</span>
              <span className="font-semibold">{stats.totalRegisteredBuyers}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Conversion (interested / viewers)</span>
              <span className="font-bold text-emerald-600">
                {stats.uniquePavilionViewers > 0 ? `${Math.round((stats.interestedCount / stats.uniquePavilionViewers) * 100)}%` : "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold mb-3">Education sessions</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Session signups</span>
              <span className="font-semibold">{stats.sessionSignups}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Attended</span>
              <span className="font-semibold">{stats.sessionAttended}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Attendance rate</span>
              <span className="font-bold text-emerald-600">
                {stats.sessionSignups > 0 ? `${Math.round((stats.sessionAttended / stats.sessionSignups) * 100)}%` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["overview", "interested", "saved", "views", "connects"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {tab === "overview" ? "Recent activity" : tab === "interested" ? `Interested (${stats.interestedCount})` : tab === "saved" ? `Saved (${stats.savedCount})` : tab === "views" ? `Views (${stats.totalPavilionViews})` : `Connects (${stats.speedConnectRequests})`}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {activeTab === "overview" && (
          <div className="divide-y divide-slate-100">
            {[...interested.slice(0, 3).map((l) => ({ type: "interested", name: l.buyers.full_name, email: l.buyers.email, state: l.buyers.state, date: l.updated_at })),
              ...saved.slice(0, 3).map((s) => ({ type: "saved", name: s.buyers.full_name, email: s.buyers.email, state: s.buyers.state, date: s.created_at })),
              ...views.slice(0, 5).map((v) => ({ type: "view", name: v.buyers.full_name, email: v.buyers.email, state: v.buyers.state, date: v.created_at })),
              ...speedConnects.slice(0, 3).map((c) => ({ type: "connect", name: c.buyers.full_name, email: c.buyers.email, state: c.buyers.state, date: c.scheduled_at })),
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span style={{
                    background: item.type === "interested" ? "#E1F5EE" : item.type === "saved" ? "#FAEEDA" : item.type === "connect" ? "#EEEDFE" : "#E6F1FB",
                    color: item.type === "interested" ? "#0F6E56" : item.type === "saved" ? "#854F0B" : item.type === "connect" ? "#3C3489" : "#0C447C",
                    fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                  }}>
                    {item.type === "interested" ? "INTERESTED" : item.type === "saved" ? "SAVED" : item.type === "connect" ? "CONNECT" : "VIEW"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.email} · {item.state}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString()}</p>
              </div>
            ))}
            {interested.length === 0 && saved.length === 0 && views.length === 0 && speedConnects.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">No activity yet. Once buyers engage with your pavilion, activity will appear here.</div>
            )}
          </div>
        )}

        {activeTab === "interested" && (
          interested.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No interested buyers yet.</div> : (
            <div className="divide-y divide-slate-100">
              {interested.map((l, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{l.buyers.full_name}</p>
                      <p className="text-xs text-slate-500">{l.buyers.email} · {l.buyers.phone ?? "No phone"} · {l.buyers.state}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {l.buyers.ownership_model && `${l.buyers.ownership_model} · `}
                        {l.buyers.investment_range && `$${l.buyers.investment_range}K budget · `}
                        {l.buyers.decision_timeline ?? ""}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(l.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "saved" && (
          saved.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No one has saved your brand yet.</div> : (
            <div className="divide-y divide-slate-100">
              {saved.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{s.buyers.full_name}</p>
                    <p className="text-xs text-slate-500">{s.buyers.email} · {s.buyers.state}</p>
                  </div>
                  <p className="text-xs text-slate-400">Saved {new Date(s.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "views" && (
          views.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No pavilion views yet.</div> : (
            <div className="divide-y divide-slate-100">
              {views.map((v, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{v.buyers.full_name}</p>
                    <p className="text-xs text-slate-500">{v.buyers.email} · {v.buyers.state}</p>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(v.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "connects" && (
          speedConnects.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No speed connect requests yet.</div> : (
            <div className="divide-y divide-slate-100">
              {speedConnects.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{c.buyers.full_name}</p>
                    <p className="text-xs text-slate-500">{c.buyers.email} · {c.buyers.phone ?? "No phone"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "scheduled" ? "bg-emerald-100 text-emerald-700" : c.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
                    <p className="text-xs text-slate-400 mt-1">{new Date(c.scheduled_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
