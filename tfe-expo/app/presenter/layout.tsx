"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV_ITEMS = [
  { name: "My Sessions", path: "/presenter" },
];

export default function PresenterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [presenterName, setPresenterName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/presenter/sessions");
      if (res.ok) {
        const data = await res.json();
        setPresenterName(data.presenter?.full_name ?? null);
      }
    }
    if (pathname !== "/presenter/login") load();
  }, [pathname]);

  if (pathname === "/presenter/login") return <>{children}</>;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/presenter/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-white">
        <div className="px-5 pt-6 pb-4">
          <p className="text-sm font-semibold">
            <span className="text-purple-400">The Franchise Edge</span>
          </p>
          <p className="text-xs text-slate-400">Presenter Portal</p>
          {presenterName && <p className="mt-2 text-sm font-medium text-white">{presenterName}</p>}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.name} onClick={() => router.push(item.path)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition ${pathname === item.path ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-5 pt-3 border-t border-slate-800">
          <button onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-800 hover:text-white">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
