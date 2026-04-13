"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Buyer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  state: string;
  created_at: string;
};

export default function AdminBuyersPage() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/buyers");
      const data = await res.json();
      setBuyers(data.buyers ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Buyers</h1>
      <p className="mt-2 text-sm text-slate-500">All registered buyers.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : buyers.length === 0 ? (
          <p className="text-sm text-slate-400">No buyers registered yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
            {buyers.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{b.full_name}</p>
                  <p className="text-xs text-slate-500">{b.email} · {b.state}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => router.push(`/admin/buyers/${b.id}/matches`)}
                    className="rounded border border-slate-200 px-3 py-1 text-xs text-amber-600 hover:bg-amber-50">
                    Manage matches
                  </button>
                  <p className="text-xs text-slate-400">
                    {new Date(b.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}