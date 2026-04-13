"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV_SECTIONS = [
  {
    label: "EVENT",
    items: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "My matched brands", path: "/dashboard/matched-brands" },
      { name: "My schedule", path: "/dashboard/schedule" },
      { name: "Speed connect", path: "/dashboard/speed-connect" },
    ],
  },
  {
    label: "DISCOVER",
    items: [
      { name: "Education sessions", path: "/dashboard/education" },
      { name: "All brands", path: "/dashboard/all-brands" },
    ],
  },
  {
    label: "MY ACTIVITY",
    items: [
      { name: "Saved brands", path: "/dashboard/saved-brands" },
      { name: "Notes & history", path: "/dashboard/notes" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [buyerName, setBuyerName] = useState("");
  const [buyerInitials, setBuyerInitials] = useState("");

  useEffect(() => {
    async function loadBuyer() {
      try {
        const res = await fetch("/api/dashboard?type=summary");
        const data = await res.json();
        const name = data.buyer?.full_name;
        if (name) {
          setBuyerName(name);
          const parts = name.split(" ");
          setBuyerInitials(parts.map((p: string) => p[0]).join("").toUpperCase().slice(0, 2));
        }
      } catch { /* ignore */ }
    }
    loadBuyer();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-white">
        <div className="px-5 pt-6 pb-4">
          <p className="text-sm font-semibold">
            <span className="text-amber-400">The Franchise Edge</span>
          </p>
          <p className="text-xs text-slate-400">Virtual Expo · Spring 2026</p>
        </div>

        {buyerName && (
          <div className="mx-4 mb-6 flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              {buyerInitials}
            </div>
            <div>
              <p className="text-sm font-medium">{buyerName}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-5 px-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-2 text-xs font-semibold tracking-widest text-slate-500">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => router.push(item.path)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        pathname === item.path
                          ? "bg-slate-700 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                        {item.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

<div className="mt-4 pt-4 border-t border-slate-700/50">
            <button onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:bg-red-900/30 hover:text-red-400 hover:border-red-800">
              Sign out
            </button>
          </div>
        </nav>

        
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
