"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Brand = { id: string; name: string; category: string; ownership_model: string; investment_min: number; investment_max: number; description: string; logo_url: string | null; calendly_link: string | null; exhibitor_tier: string | null };
type Session = { id: string; session_number: number; title: string; scheduled_time: string; duration_minutes: number; is_live: boolean };
type ScheduleEvent = { id: string; title: string; event_type: string; scheduled_at: string; duration_minutes: number; status: string };
type Buyer = { full_name: string; category_interests: string[]; ownership_model: string; investment_range: number; decision_timeline: string; liquid_capital: string };

function BrandLogo({ name, logoUrl, size = 42 }: { name: string; logoUrl?: string | null; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (logoUrl) {
    return <img src={logoUrl} alt={name} style={{ width: size, height: size, minWidth: size, maxWidth: size, borderRadius: 10, objectFit: "contain", border: "1px solid #e2e8f0", background: "white" }} />;
  }
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", color: "white", fontSize: size * 0.26, fontWeight: 600 }}>
      {initials}
    </div>
  );
}

function TierBadge({ tier }: { tier: string | null }) {
  if (tier === "title_sponsor") return <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, letterSpacing: "0.03em" }}>TITLE SPONSOR</span>;
  if (tier === "featured") return <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, letterSpacing: "0.03em" }}>FEATURED</span>;
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [matched, setMatched] = useState<Brand[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [signupMap, setSignupMap] = useState<Record<string, { status: string; attended: boolean }>>({});
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=summary");
      const data = await res.json();
      setBuyer(data.buyer ?? null);
      setMatched(data.matched ?? []);
      setAllBrands(data.brands ?? []);
      setSavedIds(new Set(data.savedIds ?? []));
      setStatusMap(data.statusMap ?? {});
      setSessions(data.sessions ?? []);
      setSignupMap(data.signupMap ?? {});
      setEvents((data.events ?? []).filter((e: ScheduleEvent) => e.status === "scheduled"));
      setLoading(false);
    }
    load();
  }, []);

  async function toggleSave(brandId: string) {
    const isSaved = savedIds.has(brandId);
    await fetch("/api/dashboard/save-brand", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, action: isSaved ? "unsave" : "save" }),
    });
    setSavedIds((prev) => { const n = new Set(prev); isSaved ? n.delete(brandId) : n.add(brandId); return n; });
  }

  async function setStatus(brandId: string, status: string) {
    const current = statusMap[brandId];
    const newStatus = current === status ? "remove" : status;
    await fetch("/api/dashboard/brand-status", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, status: newStatus }),
    });
    setStatusMap((prev) => {
      const n = { ...prev };
      if (newStatus === "remove") delete n[brandId]; else n[brandId] = newStatus;
      return n;
    });
  }

  const registeredSessions = sessions.filter((s) => signupMap[s.id]);
  const interestedCount = Object.values(statusMap).filter((s) => s === "interested").length;
  const matchedIds = new Set(matched.map((b) => b.id));
  const notInterestedIds = new Set(Object.entries(statusMap).filter(([, v]) => v === "not_interested").map(([k]) => k));

  const recommendedPool = allBrands
    .filter((b) => !matchedIds.has(b.id) && !notInterestedIds.has(b.id))
    .sort((a, b) => {
      const tierOrder = (t: string | null) => t === "title_sponsor" ? 0 : t === "featured" ? 1 : 2;
      return tierOrder(a.exhibitor_tier) - tierOrder(b.exhibitor_tier);
    });

  const featuredFirst = recommendedPool.find((b) => b.exhibitor_tier === "featured" || b.exhibitor_tier === "title_sponsor");
  const recommended = featuredFirst
    ? [featuredFirst, ...recommendedPool.filter((b) => b.id !== featuredFirst.id).slice(0, 3)]
    : recommendedPool.slice(0, 4);

  const firstName = buyer?.full_name?.split(" ")[0] ?? "";
  const categories = buyer?.category_interests ?? [];
  const ownershipLabel = buyer?.ownership_model === "semi-absentee" ? "Semi-absentee" : buyer?.ownership_model === "owner-operator" ? "Owner-operator" : buyer?.ownership_model === "multi-unit" ? "Multi-unit" : buyer?.ownership_model ?? "";
  const budgetLabel = buyer?.investment_range ? `Up to $${buyer.investment_range}K` : "";
  const timelineLabels: Record<string, string> = { "within-3-months": "Within 3 months", "3-6-months": "3–6 months", "6-12-months": "6–12 months", "12-plus-months": "12+ months" };
  const timelineLabel = timelineLabels[buyer?.decision_timeline ?? ""] ?? "";

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading dashboard...</div>;

  return (
    <div className="flex flex-1 flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-stats-row { display: flex; gap: 8px; flex: 1; }
        .dash-stats-row > div { flex: 1; }
        .dash-header-inner { display: flex; align-items: center; gap: 24px; }
        .dash-recommended-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .dash-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .dash-matched-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dash-live-badge { min-width: fit-content; display: flex; align-items: center; gap: 6px; }
        @media(max-width: 768px) {
          .dash-header-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
          .dash-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: none; width: 100%; }
          .dash-recommended-grid {
            display: flex;
            grid-template-columns: none;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            margin: 0 -12px;
            padding: 14px 12px 8px;
            gap: 10px;
          }
          .dash-recommended-grid::-webkit-scrollbar { display: none; }
          .dash-recommended-grid > div {
            flex: 0 0 240px;
            scroll-snap-align: start;
          }
          .dash-main-grid { grid-template-columns: 1fr; }
          .dash-matched-grid { grid-template-columns: 1fr; }
          .dash-live-badge { display: none; }
          .flex-1.px-8 { padding-left: 12px !important; padding-right: 12px !important; }
        }
      `}} />

      {/* Header — welcome + stats + live badge */}
      <div className="border-b border-slate-100 px-8 py-4">
        <div className="dash-header-inner">
          <div style={{ minWidth: "fit-content" }}>
            <h1 className="text-xl font-semibold">Welcome back{firstName ? `, ${firstName}` : ""}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Your virtual expo dashboard</p>
          </div>
          <div className="dash-stats-row">
            <div className="rounded-lg bg-slate-50 px-3 py-2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="text-xs font-semibold tracking-widest text-slate-400">MATCHED</span>
              <span className="text-lg font-bold">{matched.length}</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="text-xs font-semibold tracking-widest text-slate-400">SAVED</span>
              <span className="text-lg font-bold">{savedIds.size}</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="text-xs font-semibold tracking-widest text-slate-400">INTERESTED</span>
              <span className="text-lg font-bold text-emerald-600">{interestedCount}</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="text-xs font-semibold tracking-widest text-slate-400">UPCOMING</span>
              <span className="text-lg font-bold text-amber-600">{events.length + registeredSessions.length}</span>
            </div>
          </div>
          <div className="dash-live-badge">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-500">Event is live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-6">
        {/* Preferences bar */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 mb-5" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="text-sm font-semibold mb-2">Your matching preferences</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span key={c} style={{ background: "#E6F1FB", color: "#0C447C", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{c}</span>
              ))}
              {ownershipLabel && <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{ownershipLabel}</span>}
              {budgetLabel && <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{budgetLabel}</span>}
              {timelineLabel && <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{timelineLabel}</span>}
              {categories.length === 0 && !ownershipLabel && !budgetLabel && (
                <span className="text-xs text-slate-400">No preferences set yet</span>
              )}
            </div>
          </div>
          <button onClick={() => router.push("/dashboard/profile")} className="text-sm text-amber-600 hover:underline whitespace-nowrap mt-0.5">Edit preferences →</button>
        </div>

        {/* Additional recommended brands */}
        {recommended.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-500">Additional recommended brands</p>
              <button onClick={() => router.push("/dashboard/all-brands")} className="text-xs text-amber-600 hover:underline">Browse all →</button>
            </div>
            <div className="dash-recommended-grid">
              {recommended.map((b) => {
                const isFeaturedSlot = b.exhibitor_tier === "featured" || b.exhibitor_tier === "title_sponsor";
                return (
                  <div key={b.id} className="rounded-xl bg-white p-4" style={{ border: isFeaturedSlot ? "2px solid #BA7517" : "1px solid #e2e8f0", position: "relative" }}>
                    {isFeaturedSlot && (
                      <div style={{ position: "absolute", top: -10, left: 16, background: "#FAEEDA", color: "#854F0B", fontSize: 10, padding: "2px 10px", borderRadius: 10, fontWeight: 600, letterSpacing: "0.03em" }}>
                        {b.exhibitor_tier === "title_sponsor" ? "TITLE SPONSOR" : "FEATURED"}
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-2.5" style={{ marginTop: isFeaturedSlot ? 4 : 0 }}>
                      <BrandLogo name={b.name} logoUrl={b.logo_url} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <a href={`/dashboard/pavilion/${b.id}`} className="text-sm font-semibold hover:text-amber-600 transition block truncate">{b.name}</a>
                        <p className="text-xs text-slate-500 truncate">{b.category}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">${(b.investment_min / 1000).toFixed(0)}K–${(b.investment_max / 1000).toFixed(0)}K</span>
                      <div className="flex items-center gap-1.5">
                        {!isFeaturedSlot && <TierBadge tier={b.exhibitor_tier} />}
                        <button onClick={() => setStatus(b.id, "interested")}
                          className={`rounded-full px-2 py-0.5 text-xs transition ${statusMap[b.id] === "interested" ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-500 hover:bg-emerald-50"}`}>
                          {statusMap[b.id] === "interested" ? "✓" : "+"}
                        </button>
                        <button onClick={() => toggleSave(b.id)} className="text-sm" style={{ color: savedIds.has(b.id) ? "#d97706" : "#cbd5e1" }}>
                          {savedIds.has(b.id) ? "★" : "☆"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matched brands + sidebar */}
        <div className="dash-main-grid">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Matched & interested</p>
              <button onClick={() => router.push("/dashboard/matched-brands")} className="text-xs text-amber-600 hover:underline">View all →</button>
            </div>
            <div className="dash-matched-grid">
              {matched.map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <BrandLogo name={b.name} logoUrl={b.logo_url} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <a href={`/dashboard/pavilion/${b.id}`} className="text-sm font-semibold hover:text-amber-600 transition block truncate">{b.name}</a>
                      <p className="text-xs text-slate-500 truncate">{b.category} · ${(b.investment_min / 1000).toFixed(0)}K–${(b.investment_max / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TierBadge tier={b.exhibitor_tier} />
                      {statusMap[b.id] === "interested" && (
                        <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>Interested</span>
                      )}
                    </div>
                    <button onClick={() => toggleSave(b.id)} className="text-lg" style={{ color: savedIds.has(b.id) ? "#d97706" : "#cbd5e1" }}>
                      {savedIds.has(b.id) ? "★" : "☆"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {matched.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-400">
                Complete your profile to see matched brands.
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Upcoming</p>
                <button onClick={() => router.push("/dashboard/schedule")} className="text-xs text-amber-600 hover:underline">Full schedule →</button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                {registeredSessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {s.is_live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      <p className="text-sm font-medium">{s.title}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 pl-3">{s.scheduled_time} · {s.duration_minutes} min{s.is_live ? " · Live" : ""}</p>
                  </div>
                ))}
                {events.slice(0, 3).map((e) => (
                  <div key={e.id} className="px-4 py-3">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(e.scheduled_at).toLocaleDateString()} · {e.duration_minutes} min</p>
                  </div>
                ))}
                {registeredSessions.length === 0 && events.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">No upcoming events. Sign up for sessions!</div>
                )}
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "#FAEEDA", border: "1px solid #FAC775" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "#854F0B" }}>Quick actions</p>
              <div className="space-y-1.5">
                <button onClick={() => router.push("/dashboard/education")}
                  className="w-full text-left rounded-lg bg-white px-3 py-2 text-xs transition hover:bg-amber-100" style={{ color: "#854F0B", border: "1px solid #FAC775" }}>
                  Browse education sessions
                </button>
                <button onClick={() => router.push("/dashboard/all-brands")}
                  className="w-full text-left rounded-lg bg-white px-3 py-2 text-xs transition hover:bg-amber-100" style={{ color: "#854F0B", border: "1px solid #FAC775" }}>
                  Explore all brands
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
