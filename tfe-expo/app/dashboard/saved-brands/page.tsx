"use client";

import { useEffect, useState } from "react";

type SavedBrand = { brand_id: string; created_at: string; brands: { id: string; name: string; category: string; ownership_model: string; investment_min: number; investment_max: number; description: string } };

export default function SavedBrandsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<SavedBrand[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=saved");
      const data = await res.json();
      setSaved(data.saved ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleUnsave(brandId: string) {
    await fetch("/api/dashboard/save-brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, action: "unsave" }),
    });
    setSaved((prev) => prev.filter((s) => s.brand_id !== brandId));
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading saved brands...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-lg font-semibold">Saved Brands</h1>
      <p className="mt-1 text-sm text-slate-500">Brands you've bookmarked for follow-up.</p>

      {saved.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          No saved brands yet. Browse All Brands and tap ☆ to save.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {saved.map((s) => (
            <div key={s.brand_id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium">{s.brands.name}</p>
                <p className="text-xs text-slate-500">{s.brands.category} · ${(s.brands.investment_min / 1000).toFixed(0)}K–${(s.brands.investment_max / 1000).toFixed(0)}K</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-slate-400">Saved {new Date(s.created_at).toLocaleDateString()}</p>
                <button onClick={() => handleUnsave(s.brand_id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
