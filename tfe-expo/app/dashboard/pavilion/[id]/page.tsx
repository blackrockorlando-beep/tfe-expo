"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Territory = { territory_name: string; status: string };
type Validation = { initials: string; name: string; location: string; months_open: number; quote: string; rating: number };
type SupportValue = { provided: boolean; support_items: { item_name: string; support_type: string } };
type DocItem = { title: string; description: string; access_type: string };
type InvestmentItem = { label: string; low: number; high: number };
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
  documents: DocItem[];
  initial_investment_items: InvestmentItem[];
  support_values: SupportValue[]; rep_name: string; rep_title: string;
  calendly_link: string | null; pitch_time: string; pitch_duration: string;
  logo_url: string | null; hero_image_url: string | null;
};

function fmt(n: number | null | undefined): string {
  if (!n) return "N/A";
  return "$" + n.toLocaleString();
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return "N/A";
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(1)}%`;
}

function calcRIR(auv: number | null | undefined, min: number | null | undefined, max: number | null | undefined): string {
  if (!auv || !min || !max) return "N/A";
  const avg = (min + max) / 2;
  if (avg === 0) return "N/A";
  const ratio = auv / avg;
  return ratio.toFixed(1) + "×";
}

export default function PavilionPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "investment" | "financials" | "territory" | "support" | "documents" | "validation">("overview");

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
      <button onClick={() => router.back()} className="mb-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
        ← Back
      </button>

      {/* Header */}
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
          <p className="mt-1 text-sm font-bold">{fmt(brand.investment_min)}–{fmt(brand.investment_max)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">Franchise Fee</p>
          <p className="mt-1 text-sm font-bold">{fmt(brand.franchise_fee)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">Royalty</p>
          <p className="mt-1 text-sm font-bold">{fmtPct(brand.royalty_pct)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-400">AUV</p>
          <p className="mt-1 text-sm font-bold">{fmt(brand.auv)}</p>
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
        {(["overview", "investment", "financials", "territory", "support", "documents", "validation"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {tab === "overview" ? "Overview" : tab === "investment" ? "Investment" : tab === "financials" ? "Financials" : tab === "territory" ? "Territory" : tab === "support" ? "Support" : tab === "documents" ? "Documents" : "Validation"}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div style={{ display: "grid", gridTemplateColumns: brand.hero_image_url ? "280px 1fr" : "1fr", gap: "24px" }}>
              {brand.hero_image_url && (
                <div>
                  <img src={brand.hero_image_url} alt={brand.name}
                    style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, border: "1px solid #e2e8f0" }} />
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

        {/* INVESTMENT TAB */}
        {activeTab === "investment" && (
          <div className="space-y-6">
            {brand.initial_investment_items?.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Initial Investment (Item 7)</h3>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "#1e293b", padding: "10px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1 }}>Type of Expenditure</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Amount (Low – High)</span>
                  </div>
                  {brand.initial_investment_items.map((item, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1.2fr 1fr", padding: "12px 16px",
                      borderBottom: "1px solid #f1f5f9",
                      background: i % 2 === 0 ? "#ffffff" : "#f0f4f8",
                    }}>
                      <span style={{ fontSize: 14, color: "#334155", fontWeight: item.label.toLowerCase().includes("franchise fee") ? 600 : 400 }}>{item.label}</span>
                      <span style={{ fontSize: 14, color: "#334155", textAlign: "center", fontWeight: 500 }}>
                        {item.low === item.high ? fmt(item.low) : `${fmt(item.low)} – ${fmt(item.high)}`}
                      </span>
                    </div>
                  ))}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1.2fr 1fr", padding: "14px 16px",
                    background: "#f0fdf4", borderTop: "2px solid #166534",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>Total Estimated Initial Investment</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#166534", textAlign: "center" }}>
                      {fmt(brand.investment_min)} – {fmt(brand.investment_max)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No initial investment breakdown available. Contact the franchisor for Item 7 details.</p>
            )}
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === "financials" && (
          <div className="space-y-8">

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1.5px solid #166534", borderRadius: 12 }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "#166534" }}>Median Gross</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#166534" }}>{fmt(brand.item19_median_gross)}</p>
              </div>
              <div className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1.5px solid #166534", borderRadius: 12 }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "#166534" }}>Top Quartile</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#166534" }}>{fmt(brand.item19_top_quartile_gross)}</p>
              </div>
              <div className="rounded-xl p-5 text-center" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1.5px solid #166534", borderRadius: 12 }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "#166534" }}>Revenue to Investment Ratio</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#166534" }}>{calcRIR(brand.auv, brand.investment_min, brand.investment_max)}</p>
              </div>
            </div>

            {/* Item 19 Performance */}
            {brand.item19_present ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Item 19 Financial Performance ({brand.item19_fiscal_year})</h3>
                  <p className="text-sm text-slate-600">{brand.item19_summary}</p>
                </div>

                {/* P&L bar chart */}
                {brand.item19_pnl?.length > 0 && brand.item19_pnl.some(r => r.amount > 0) ? (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Unit-Level P&L</h3>
                    <div className="space-y-3">
                      {brand.item19_pnl.map((row, i) => {
                        const isEarnings = row.label.toLowerCase().includes("earnings") || row.label.toLowerCase().includes("ebitda");
                        const barWidth = Math.max(row.pct, 2);
                        return (
                          <div key={i}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: isEarnings ? "#047857" : "#475569" }}>{row.label}</span>
                              <span style={{ fontSize: 14, fontWeight: 600, color: isEarnings ? "#047857" : "#334155" }}>{fmt(row.amount)}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ height: 20, borderRadius: 10, width: `${barWidth}%`, background: isEarnings ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #f87171, #fca5a5)" }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>{fmtPct(row.pct)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 p-6" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Understanding Item 19 (Financial Performance Information)</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">Not all franchisors include detailed P&L data in their Item 19. While many brands choose to share financial performance information, some franchisors prefer not to provide this level of detail for a variety of legitimate reasons.</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">What&apos;s most important is that you still have the ability to gather the insights you need to make an informed decision.</p>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">How to Get the Full Picture</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">We strongly encourage you to speak directly with existing franchisees. Ask about their sales, expenses, and overall performance. Understand what it really takes to succeed in their market. These conversations often provide real-world context and transparency that goes beyond what any document can show.</p>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Our Recommendation</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Use this opportunity to ask thoughtful, specific questions and compare feedback across multiple operators. The franchisee validation tab is a great place to start.</p>
                  </div>
                )}

                {brand.item19_notes && (
                  <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs text-slate-500 italic leading-relaxed">{brand.item19_notes}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 p-6" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Understanding Item 19 (Financial Performance Information)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Not all franchisors include an Item 19 in their Franchise Disclosure Document (FDD). While many brands choose to share financial performance information, it is not required, and some franchisors prefer not to provide this data for a variety of legitimate reasons.</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">What&apos;s most important is that you still have the ability to gather the insights you need to make an informed decision.</p>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">How to Get the Full Picture</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">We strongly encourage you to speak directly with existing franchisees. Ask about their sales, expenses, and overall performance. Understand what it really takes to succeed in their market. These conversations often provide real-world context and transparency that goes beyond what any document can show.</p>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Our Recommendation</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Use this opportunity to ask thoughtful, specific questions and compare feedback across multiple operators. The franchisee validation tab is a great place to start.</p>
              </div>
            )}
          </div>
        )}

        {/* TERRITORY TAB */}
        {activeTab === "territory" && (
          <div className="space-y-6">
            {brand.territory_description && <p className="text-sm text-slate-600">{brand.territory_description}</p>}
            {brand.territories?.length > 0 ? (
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {brand.territories.map((t, i) => (
                  <div key={i} className="flex items-center px-4 py-3" style={{ gap: '1.5rem' }}>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.status === "Open" ? "bg-emerald-100 text-emerald-700" : t.status === "Limited" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {t.status}
                    </span>
                    <p className="text-sm">{t.territory_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No territory information available.</p>
            )}
          </div>
        )}

        {/* SUPPORT TAB */}
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

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            {brand.documents?.length > 0 ? (
              brand.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${doc.access_type === "Download" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {doc.access_type}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No documents available.</p>
            )}
          </div>
        )}

        {/* VALIDATION TAB */}
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
