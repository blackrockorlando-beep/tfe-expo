"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Brand = { id: string; name: string; category: string; ownership_model: string; investment_min: number; investment_max: number; logo_url: string | null };

export default function BuyerMatchesPage() {
  const params = useParams();
  const router = useRouter();
  const buyerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [buyer, setBuyer] = useState<{ full_name: string; email: string; category_interests: string[]; ownership_model: string; investment_range: number } | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [manualMap, setManualMap] = useState<Record<string, string>>({});
  const [autoIds, setAutoIds] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/buyer-matches?buyerId=${buyerId}`);
      const data = await res.json();
      setBuyer(data.buyer);
      setBrands(data.brands ?? []);
      setManualMap(data.manualMap ?? {});
      setAutoIds(new Set(data.autoMatchIds ?? []));
      setStatusMap(data.statusMap ?? {});
      setLoading(false);
    }
    load();
  }, [buyerId]);

  async function setMatchAction(brandId: string, action: string) {
    setSaving(brandId);
    await fetch("/api/admin/buyer-matches", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, brandId, action }),
    });
    setManualMap((prev) => {
      const n = { ...prev };
      if (action === "reset") delete n[brandId];
      else n[brandId] = action === "include" ? "include" : "exclude";
      return n;
    });
    setSaving(null);
  }

  const filtered = brands.filter((b) => {
    if (!filter) return true;
    return b.name.toLowerCase().includes(filter.toLowerCase()) || b.category.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading...</div>;

  return (
    <div className="px-8 py-8">
      <button onClick={() => router.push("/admin/buyers")} className="text-xs text-slate-400 hover:text-slate-600 mb-2">← Back to buyers</button>
      <h1 className="text-xl font-semibold">Manage brand matches</h1>
      <p className="mt-1 text-sm text-slate-500">{buyer?.full_name} · {buyer?.email}</p>

      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 mt-4 mb-6">
        <p className="text-sm font-semibold mb-2">Buyer preferences (auto-match criteria)</p>
        <div className="flex flex-wrap gap-1.5">
          {(buyer?.category_interests ?? []).map((c) => (
            <span key={c} style={{ background: "#E6F1FB", color: "#0C447C", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{c}</span>
          ))}
          {buyer?.ownership_model && <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>{buyer.ownership_model}</span>}
          {buyer?.investment_range && <span style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 12, padding: "4px 10px", borderRadius: 12 }}>Up to ${buyer.investment_range}K</span>}
        </div>
        <p className="text-xs text-slate-400 mt-2">Auto = matched by preferences. Include = admin forced match. Exclude = admin removed from matches even if auto-qualified.</p>
      </div>

      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search brands..."
        className="mb-4 w-64 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 ring-slate-300" />

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Brand</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Investment</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">Auto-matched</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">Match status</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">Buyer shows</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Buyer status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((b) => {
              const isAuto = autoIds.has(b.id);
              const manual = manualMap[b.id];
              const isExcluded = manual === "exclude";
              const isIncluded = manual === "include";
              const willShow = isExcluded ? false : (isAuto || isIncluded);
              const status = statusMap[b.id];

              return (
                <tr key={b.id} className={`hover:bg-slate-50 ${isExcluded ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} style={{ width: 32, height: 32, minWidth: 32, maxWidth: 32, borderRadius: 8, objectFit: "contain", border: "1px solid #e2e8f0", background: "white" }} />
                      ) : (
                        <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", color: "white", fontSize: 10, fontWeight: 600 }}>
                          {b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                      )}
                      <span className="font-medium">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{b.category}</td>
                  <td className="px-5 py-3 text-slate-600">${(b.investment_min / 1000).toFixed(0)}K–${(b.investment_max / 1000).toFixed(0)}K</td>
                  <td className="px-5 py-3 text-center">
                    {isAuto ? <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 500 }}>Auto</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setMatchAction(b.id, isIncluded ? "reset" : "include")} disabled={saving === b.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${isIncluded ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-emerald-300"}`}>
                        {saving === b.id ? "..." : isIncluded ? "✓ Include" : "+ Include"}
                      </button>
                      <button onClick={() => setMatchAction(b.id, isExcluded ? "reset" : "exclude")} disabled={saving === b.id}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${isExcluded ? "bg-red-100 text-red-700 border border-red-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-red-300"}`}>
                        {saving === b.id ? "..." : isExcluded ? "✗ Excluded" : "Exclude"}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {willShow ? (
                      <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 500 }}>Visible</span>
                    ) : (
                      <span style={{ background: "#FCEBEB", color: "#791F1F", fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 500 }}>Hidden</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {status === "interested" && <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, padding: "3px 8px", borderRadius: 12 }}>Interested</span>}
                    {status === "not_interested" && <span style={{ background: "#FCEBEB", color: "#791F1F", fontSize: 11, padding: "3px 8px", borderRadius: 12 }}>Not interested</span>}
                    {!status && <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}