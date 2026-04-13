"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Brand = { id: string; name: string; category: string; ownership_model: string; investment_min: number; investment_max: number; description: string; calendly_link: string | null; logo_url: string | null; hero_image_url: string | null; exhibitor_tier: string | null };

function BrandLogo({ name, logoUrl, size = 48 }: { name: string; logoUrl?: string | null; size?: number }) {
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
  if (tier === "title_sponsor") return <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>TITLE SPONSOR</span>;
  if (tier === "featured") return <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>FEATURED</span>;
  return null;
}

export default function MatchedBrandsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState<Brand[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=summary");
      const data = await res.json();
      setMatched(data.matched ?? []);
      setSavedIds(new Set(data.savedIds ?? []));
      setStatusMap(data.statusMap ?? {});
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
    if (newStatus === "not_interested") {
      setMatched((prev) => prev.filter((b) => b.id !== brandId));
    }
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading matched brands...</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Matched & Interested</h1>
          <p className="mt-1 text-sm text-slate-500">{matched.length} brands match your preferences</p>
        </div>
        <button onClick={() => router.push("/dashboard/profile")} className="text-xs text-amber-600 hover:underline">Update preferences →</button>
      </div>

      {matched.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-400">No matches yet. Update your profile to see matched brands.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {matched.map((b) => {
            const status = statusMap[b.id];
            return (
              <div key={b.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-5" style={{ display: "flex", gap: "20px" }}>
                  {b.hero_image_url && (
                    <a href={`/dashboard/pavilion/${b.id}`} style={{ flexShrink: 0 }}>
                      <img src={b.hero_image_url} alt={b.name} style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }} />
                    </a>
                  )}
                  <div style={{ flex: 1 }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <BrandLogo name={b.name} logoUrl={b.logo_url} size={48} />
                        <div>
                          <div className="flex items-center gap-2">
                            <a href={`/dashboard/pavilion/${b.id}`} className="text-sm font-semibold hover:text-amber-600 transition">{b.name}</a>
                            <TierBadge tier={b.exhibitor_tier} />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{b.category} · ${(b.investment_min / 1000).toFixed(0)}K–${(b.investment_max / 1000).toFixed(0)}K · {b.ownership_model}</p>
                          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{b.description}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleSave(b.id)} className="text-xl" style={{ color: savedIds.has(b.id) ? "#d97706" : "#cbd5e1" }}>
                        {savedIds.has(b.id) ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => setStatus(b.id, "interested")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${status === "interested" ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-emerald-300"}`}>
                        {status === "interested" ? "✓ Interested" : "Interested"}
                      </button>
                      <button onClick={() => setStatus(b.id, "not_interested")}
                        className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 border border-slate-200 hover:border-red-300 transition">
                        Not interested
                      </button>
                      {b.calendly_link && (
                        <a href={b.calendly_link} target="_blank" rel="noopener noreferrer"
                          className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-300 hover:bg-amber-200">
                          Schedule call ↗
                        </a>
                      )}
                      <button onClick={() => router.push(`/dashboard/pavilion/${b.id}`)}
                        className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-100">
                        View pavilion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
