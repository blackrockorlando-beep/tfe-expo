"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV_ITEMS = [
  { name: "Brand Profile", path: "/franchisor" },
  { name: "Dashboard & Leads", path: "/franchisor/leads" },
  { name: "Schedule", path: "/franchisor/schedule" },
];

export default function FranchisorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [brandName, setBrandName] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrand() {
      const res = await fetch("/api/franchisor/brand");
      if (res.ok) {
        const data = await res.json();
        setBrandName(data.brand?.name ?? null);
      }
    }
    if (pathname !== "/franchisor/login") loadBrand();
  }, [pathname]);

  if (pathname === "/franchisor/login") return <>{children}</>;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/franchisor/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-white">
        <div className="px-5 pt-6 pb-4">
          <p className="text-sm font-semibold">
            <span className="text-amber-400">The Franchise Edge</span>
          </p>
          <p className="text-xs text-slate-400">Franchisor Portal</p>
          {brandName && <p className="mt-2 text-sm font-medium text-white">{brandName}</p>}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition ${
                pathname === item.path
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="px-5 py-5 space-y-3">
          <button onClick={handleSignOut}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            Sign out
          </button>
          <p className="text-xs text-slate-500">TFE Virtual Expo</p>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}