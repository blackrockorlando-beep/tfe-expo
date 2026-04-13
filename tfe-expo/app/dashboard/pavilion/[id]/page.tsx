"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Territory = { territory_name: string; status: string };
type Validation = { initials: string; name: string; location: string; months_open: number; quote: string; rating: number };
type SupportValue = { provided: boolean; support_items: { item_name: string; support_type: string } };
type Brand = {
  id: string; name: string; slug: string; category: string; description: string; overview: string;
  ownership_model: string; ownership_model_detail: string; investment_min: number; investment_max: number;
  franchise_fee: number; royalty_pct: number; auv: number; payback_period: string;
  liquid_capital_required: number; sba_eligible: boolean; unit_count: number; years_franchising: string;
  location_type: string; operating_hours: string; staff_at_open: string; revenue_mix: string;
  item19_present: boolean; item19_fiscal_year: string; item19_summary: string;
  item19_median_gross: number; item19_top_quartile_gross: number; item19_bottom_quartile_gross: number;
  item19_avg_net_revenue: number; item19_notes: string; item19_pnl: { label: string; amount: number; pct: number; color: string }[];
  territory_description: string; territories: Territory[]; validations: Validation[];
  support_values: SupportValue[]; rep_name: string; rep_title: string;
  calendly_link: string | null; pitch_time: string; pitch_duration: string;
  logo_url: string | null; hero_image_url: string | null;
};

export default function PavilionPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "financials" | "territory" | "support" | "validation">("overview");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/dashboard/pavilion/${brandId}`);
      const data = await res.json();
      setBrand(data.brand);
      setStatus(data.buyerStatus);
      setSaved(data.isSaved);
      setLoading(false);
    }
    load();
  }, [brandId]);

  async function toggleSave() {
    await fetch("/api/dashboard/save-brand", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, action: saved ? "unsave" : "save" }),
    });
    setSaved(!saved);
  }

  async function setBrandStatus(newStatus: string) {
    const action = status === newStatus ? "remove" : newStatus;
    await fetch("/api/dashboard/brand-status", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, status: action }),
    });
    if (action === "interested") {
      router.push("/dashboard");
    } else {
      setStatus(action === "remove" ? null : newStatus);
    }
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading pavilion...</div>;
  if (!brand) return <div className="p-8 text-sm text-red-500">Brand not found.</div>;

  const ongoingSupport = brand.support_values.filter((s) => s.provided && s.support_items?.support_type === "ongoing").map((s) => s.support_items.item_name);
  const marketingSupport = brand.support_values.filter((s) => s.provided && s.support_items?.support_type === "marketing").map((s) => s.support_items.item_name);

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <button onClick={() => router.back()} className="text-xs text-slate-400 hover:text-slate-600 mb-2">← Back</button>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
        {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-24 w-24 rounded-xl object-contain border border-slate-200 bg-white" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{brand.name}</h1>
            <p className="text-sm text-slate-500">{brand.category} · {brand.ownership_model} · {brand.unit_count} units</p>
            <p className="mt-1 text-sm text-slate-600">{brand.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleSave} className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${saved ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {saved ? "★ Saved" : "☆ Save"}
          </button>
          <button onClick={() => setBrandStatus("interested")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${status === "interested" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {status === "interested" ? "✓ Interested" : "Interested"}
          </button>
          <button onClick={() => setBrandStatus("not_interested")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${status === "not_interested" ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            Not interested
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginTop: "24px" }}>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">Investment</p>
          <p className="mt-1 text-sm font-bold">${(brand.investment_min / 1000).toFixed(0)}K–${(brand.investment_max / 1000).toFixed(0)}K</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">Franchise Fee</p>
          <p className="mt-1 text-sm font-bold">${(brand.franchise_fee / 1000).toFixed(0)}K</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">Royalty</p>
          <p className="mt-1 text-sm font-bold">{brand.royalty_pct}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">AUV</p>
          <p className="mt-1 text-sm font-bold">${brand.auv ? `${(brand.auv / 1000).toFixed(0)}K` : "N/A"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">SBA Eligible</p>
          <p className="mt-1 text-sm font-bold">{brand.sba_eligible ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Actions bar */}
      {(brand.calendly_link || brand.rep_name) && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
          <div>
            {brand.rep_name && <p className="text-sm font-medium text-amber-900">Contact: {brand.rep_name}{brand.rep_title ? `, ${brand.rep_title}` : ""}</p>}
            {brand.pitch_time && <p className="text-xs text-amber-700 mt-0.5">Pitch: {brand.pitch_time} · {brand.pitch_duration}</p>}
          </div>
          {brand.calendly_link && (
            <a href={brand.calendly_link} target="_blank" rel="noopener noreferrer"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition">
              Schedule a call ↗
            </a>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(["overview", "financials", "territory", "support", "validation"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {tab === "overview" ? "Overview" : tab === "financials" ? "Financials" : tab === "territory" ? "Territory" : tab === "support" ? "Support" : "Validation"}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      {activeTab === "overview" && (
          <div className="space-y-6">
            <div style={{ display: "grid", gridTemplateColumns: brand.hero_image_url ? "280px 1fr" : "1fr", gap: "24px" }}>
              {brand.hero_image_url && (
                <div>
                  <img
                    src={brand.hero_image_url}
                    alt={brand.name}
                    style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, border: "1px solid #e2e8f0" }}
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">About {brand.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{brand.overview || brand.description}</p>
              </div>
            </div>
            {brand.ownership_model_detail && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Ownership Model</h3>
                <p className="text-sm text-slate-600">{brand.ownership_model_detail}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {brand.location_type && <div><p className="text-xs text-slate-400">Location Type</p><p className="text-sm font-medium mt-0.5">{brand.location_type}</p></div>}
              {brand.operating_hours && <div><p className="text-xs text-slate-400">Operating Hours</p><p className="text-sm font-medium mt-0.5">{brand.operating_hours}</p></div>}
              {brand.staff_at_open && <div><p className="text-xs text-slate-400">Staff at Open</p><p className="text-sm font-medium mt-0.5">{brand.staff_at_open}</p></div>}
              {brand.revenue_mix && <div><p className="text-xs text-slate-400">Revenue Mix</p><p className="text-sm font-medium mt-0.5">{brand.revenue_mix}</p></div>}
              {brand.years_franchising && <div><p className="text-xs text-slate-400">Franchising Since</p><p className="text-sm font-medium mt-0.5">{brand.years_franchising}</p></div>}
              {brand.payback_period && <div><p className="text-xs text-slate-400">Payback Period</p><p className="text-sm font-medium mt-0.5">{brand.payback_period}</p></div>}
            </div>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="space-y-6">
            {brand.item19_present ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Item 19 Financial Performance ({brand.item19_fiscal_year})</h3>
                  <p className="text-sm text-slate-600">{brand.item19_summary}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-slate-200 p-4 text-center">
                    <p className="text-xs text-slate-400">Median Gross</p>
                    <p className="text-lg font-bold mt-1">${brand.item19_median_gross ? (brand.item19_median_gross / 1000).toFixed(0) + "K" : "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4 text-center">
                    <p className="text-xs text-slate-400">Top Quartile</p>
                    <p className="text-lg font-bold mt-1">${brand.item19_top_quartile_gross ? (brand.item19_top_quartile_gross / 1000).toFixed(0) + "K" : "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4 text-center">
                    <p className="text-xs text-slate-400">Avg Net Revenue</p>
                    <p className="text-lg font-bold mt-1">${brand.item19_avg_net_revenue ? (brand.item19_avg_net_revenue / 1000).toFixed(0) + "K" : "N/A"}</p>
                  </div>
                </div>
                {brand.item19_pnl?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Unit-Level P&L</h3>
                    <div className="space-y-2">
                      {brand.item19_pnl.map((row, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-48 text-sm text-slate-600">{row.label}</div>
                          <div className="flex-1 h-6 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(row.pct, 100)}%`, background: row.color }} />
                          </div>
                          <div className="w-20 text-right text-sm font-medium">${(row.amount / 1000).toFixed(0)}K</div>
                          <div className="w-12 text-right text-xs text-slate-400">{row.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {brand.item19_notes && <p className="text-xs text-slate-400 italic">{brand.item19_notes}</p>}
              </>
            ) : (
              <p className="text-sm text-slate-400">This brand does not provide Item 19 financial performance data.</p>
            )}
          </div>
        )}

        {activeTab === "territory" && (
          <div className="space-y-6">
            {brand.territory_description && <p className="text-sm text-slate-600">{brand.territory_description}</p>}
            {brand.territories?.length > 0 ? (
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {brand.territories.map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <p className="text-sm">{t.territory_name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.status === "Open" ? "bg-emerald-100 text-emerald-700" : t.status === "Limited" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No territory information available.</p>
            )}
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            {ongoingSupport.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Ongoing Support</h3>
                <div className="flex flex-wrap gap-2">
                  {ongoingSupport.map((s) => (
                    <span key={s} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {marketingSupport.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Marketing Support</h3>
                <div className="flex flex-wrap gap-2">
                  {marketingSupport.map((s) => (
                    <span key={s} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {ongoingSupport.length === 0 && marketingSupport.length === 0 && (
              <p className="text-sm text-slate-400">No support details available.</p>
            )}
          </div>
        )}

        {activeTab === "validation" && (
          <div className="space-y-4">
            {brand.validations?.length > 0 ? (
              brand.validations.map((v, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">{v.initials}</div>
                      <div>
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.location} · {v.months_open} months</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-sm ${s <= v.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">&ldquo;{v.quote}&rdquo;</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No franchisee validation data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
