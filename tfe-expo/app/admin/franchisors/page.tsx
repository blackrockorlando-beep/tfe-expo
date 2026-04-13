"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Brand = {
  id: string;
  name: string;
  slug: string;
  category: string;
  ownership_model: string;
  investment_min: number;
  investment_max: number;
  unit_count: number;
};

export default function FranchisorsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      const res = await fetch("/api/admin/brands");
      const data = await res.json() as { brands: Brand[] };
      setBrands(data.brands ?? []);
      setLoading(false);
    }
    fetchBrands();
  }, []);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Franchisors</h1>
        <button
          onClick={() => router.push("/admin/franchisors/new")}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add new franchisor
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{brand.name}</p>
                  <p className="text-xs text-slate-500">
                    {brand.category} · {brand.ownership_model} · {brand.unit_count} units
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-slate-500">
                    ${(brand.investment_min / 1000).toFixed(0)}K–${(brand.investment_max / 1000).toFixed(0)}K
                  </p>
                  <button
                    onClick={() => router.push(`/admin/franchisors/${brand.id}`)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}