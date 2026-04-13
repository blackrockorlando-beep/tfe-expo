"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    brands: number; buyers: number; sessions: number; signups: number;
    connects: number; interested: number; pavilionViews: number; presenters: number;
    brandViews: { id: string; name: string; logo_url: string | null; count: number }[];
  }>({
    brands: 0, buyers: 0, sessions: 0, signups: 0,
    connects: 0, interested: 0, pavilionViews: 0, presenters: 0,
    brandViews: [],
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Active Brands", value: stats.brands, link: "/admin/franchisors", action: "Manage franchisors →" },
    { label: "Registered Buyers", value: stats.buyers, link: "/admin/buyers", action: "View buyers →" },
    { label: "Education Sessions", value: stats.sessions, link: "/admin/education", action: "Manage sessions →" },
    { label: "Session Signups", value: stats.signups, link: "/admin/education", action: "View registrants →" },
    { label: "Brands Interested", value: stats.interested, link: "/admin/buyers", action: "View engagement →" },
    { label: "Speed Connects", value: stats.connects, link: "/admin/sessions", action: "View connects →" },
    { label: "Pavilion Views", value: stats.pavilionViews, link: "/admin/franchisors", action: "View brands →" },
    { label: "Presenters", value: stats.presenters, link: "/admin/presenter-accounts", action: "Manage presenters →" },
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">TFE Virtual Expo management portal</p>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold">{loading ? "—" : card.value}</p>
            <p className="mt-1 text-sm text-slate-600">{card.label}</p>
            <button onClick={() => router.push(card.link)} className="mt-3 text-xs text-amber-600 hover:underline">
              {card.action}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={() => router.push("/admin/franchisors/new")}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
          + Add new franchisor
        </button>
        <button onClick={() => router.push("/admin/education/new")}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          + New education session
        </button>
        <button onClick={() => router.push("/admin/franchisors/accounts")}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          + Create franchisor account
        </button>
      </div>
      {/* Pavilion Views by Brand */}
      {stats.brandViews?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Pavilion Views by Brand</h2>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="text-sm" style={{ maxWidth: 500 }}>
              <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Brand</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Views</th>
                </tr>
                    </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.brandViews.map((b: { id: string; name: string; logo_url: string | null; count: number }) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} style={{ width: 32, height: 32, minWidth: 32, maxWidth: 32 }} className="rounded-lg object-contain border border-slate-200 bg-white" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                            {b.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <span className="font-medium">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-left font-semibold">{b.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}