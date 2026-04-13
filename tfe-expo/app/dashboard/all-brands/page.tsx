"use client";

import { useEffect, useState } from "react";

type Brand = { id: string; name: string; slug: string; category: string; ownership_model: string; investment_min: number; investment_max: number; description: string; calendly_link: string | null; logo_url: string | null; hero_image_url: string | null; exhibitor_tier: string | null };

function BrandLogo({ name, logoUrl, size = 44 }: { name: string; logoUrl?: string | null; size?: number }) {
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

export default function AllBrandsPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=summary");
      const data = await res.json();
      setBrands(data.brands ?? []);
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
  }

  const categories = [...new Set(brands.map((b) => b.category))].sort();
  const filtered = brands.filter((b) => {
    if (filter && !b.name.toLowerCase().includes(filter.toLowerCase()) && !b.category.toLowerCase().includes(filter.toLowerCase())) return false;
    if (categoryFilter && b.category !== categoryFilter) return false;
    if (statusFilter === "interested" && statusMap[b.id] !== "interested") return false;
    if (statusFilter === "not_interested" && statusMap[b.id] !== "not_interested") return false;
    if (statusFilter === "saved" && !savedIds.has(b.id)) return false;
    if (statusFilter === "none" && (statusMap[b.id] || savedIds.has(b.id))) return false;
    return true;
  });

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading brands...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-lg font-semibold">All Exhibiting Brands</h1>
      <p className="mt-1 text-sm text-slate-500">{brands.length} brands at this expo</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search brands..."
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 ring-slate-300 w-64" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none">
          <option value="">All statuses</option>
          <option value="interested">Interested</option>
          <option value="not_interested">Not interested</option>
          <option value="saved">Saved</option>
          <option value="none">No status</option>
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((b) => {
          const status = statusMap[b.id];
          return (
            <div key={b.id} className={`rounded-xl bg-white overflow-hidden transition ${status === "not_interested" ? "opacity-60" : ""}`} style={{ border: status === "not_interested" ? "1px solid #f1f5f9" : "1px solid #e2e8f0" }}>
              <div className="p-5" style={{ display: "flex", gap: "20px" }}>
                {b.hero_image_url && (
                  <a href={`/dashboard/pavilion/${b.id}`} style={{ flexShrink: 0 }}>
                    <img src={b.hero_image_url} alt={b.name} style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }} />
                  </a>
                )}
                <div style={{ flex: 1 }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <BrandLogo name={b.name} logoUrl={b.logo_url} size={44} />
                      <div>
                        <div className="flex items-center gap-2">
                          <a href={`/dashboard/pavilion/${b.id}`} className="text-sm font-semibold hover:text-amber-600 transition">{b.name}</a>
                          <TierBadge tier={b.exhibitor_tier} />
                        </div>
                        <p className="text-xs text-slate-500">{b.category} · {b.ownership_model}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSave(b.id)} className="text-xl" style={{ color: savedIds.has(b.id) ? "#d97706" : "#cbd5e1" }}>
                      {savedIds.has(b.id) ? "★" : "☆"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">{b.description}</p>
                  <p className="mt-1 text-xs text-slate-400">${(b.investment_min / 1000).toFixed(0)}K–${(b.investment_max / 1000).toFixed(0)}K</p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button onClick={() => setStatus(b.id, "interested")}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${status === "interested" ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-emerald-300"}`}>
                      {status === "interested" ? "✓ Interested" : "Interested"}
                    </button>
                    <button onClick={() => setStatus(b.id, "not_interested")}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${status === "not_interested" ? "bg-red-100 text-red-700 border border-red-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-red-300"}`}>
                      {status === "not_interested" ? "✗ Not interested" : "Not interested"}
                    </button>
                    {b.calendly_link && (
                      <a href={b.calendly_link} target="_blank" rel="noopener noreferrer"
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-300 hover:bg-amber-200 transition">
                        Schedule call ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="mt-8 text-center text-sm text-slate-400">No brands match your filters.</div>}
    </div>
  );
}
