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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const sidebarContent = (
    <>
      <div style={{ padding: "24px 20px 16px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B" }}>The Franchise Edge</p>
        <p style={{ fontSize: 12, color: "#94A3B8" }}>Virtual Expo · Spring 2026</p>
      </div>

      {buyerName && (
        <div style={{ margin: "0 16px 24px", display: "flex", alignItems: "center", gap: 12, background: "#1E293B", borderRadius: 8, padding: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {buyerInitials}
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#fff", margin: 0 }}>{buyerName}</p>
        </div>
      )}

      <nav style={{ flex: 1, padding: "0 16px" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", color: "#64748B", marginBottom: 8 }}>
              {section.label}
            </p>
            {section.items.map((item) => (
              <button key={item.name}
                onClick={() => { router.push(item.path); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 14, textAlign: "left",
                  background: pathname === item.path ? "#334155" : "transparent",
                  color: pathname === item.path ? "#fff" : "#94A3B8",
                  marginBottom: 2,
                }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: pathname === item.path ? "#F59E0B" : "#475569", flexShrink: 0 }} />
                {item.name}
              </button>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handleSignOut}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94A3B8", fontSize: 14, cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-sidebar { display: flex; width: 224px; flex-shrink: 0; flex-direction: column; background: #0F172A; color: #fff; min-height: 100vh; }
        .dash-mobile-header { display: none; }
        .dash-overlay { display: none; }
        .dash-mobile-sidebar { display: none; }
     @media(max-width: 768px) {
          .dash-sidebar { display: none; }
          .dash-mobile-header {
            display: flex; align-items: center; justify-content: space-between;
            position: sticky; top: 0; z-index: 50;
            background: #0F172A; padding: 12px 16px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .dash-overlay {
            display: ${menuOpen ? "block" : "none"};
            position: fixed; inset: 0; z-index: 90;
            background: rgba(0,0,0,0.5);
          }
          .dash-mobile-sidebar {
            display: flex; flex-direction: column;
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
            width: 280px; background: #0F172A;
            transform: translateX(${menuOpen ? "0" : "-100%"});
            transition: transform 0.25s ease;
            overflow-y: auto;
          }
          main { padding: 0 !important; }
          .px-8 { padding-left: 16px !important; padding-right: 16px !important; }
        }   
      `}} />

      <div style={{ display: "flex", minHeight: "100vh", background: "#fff", color: "#0F172A" }}>
        {/* Desktop sidebar */}
        <aside className="dash-sidebar">
          {sidebarContent}
        </aside>

        {/* Mobile header */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div className="dash-mobile-header">
            <button onClick={() => setMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B" }}>The Franchise Edge</span>
            <div style={{ width: 24 }} />
          </div>

          {/* Mobile overlay */}
          <div className="dash-overlay" onClick={() => setMenuOpen(false)} />

          {/* Mobile slide-out sidebar */}
          <div className="dash-mobile-sidebar">
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px" }}>
              <button onClick={() => setMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </div>

          <main style={{ flex: 1, overflowX: "hidden", maxWidth: "100vw" }}>{children}</main>
        </div>
      </div>
    </>
  );
}