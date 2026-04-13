"use client";

import { useEffect, useState } from "react";

type Brand = { id: string; name: string; category: string; logo_url: string | null; calendly_link: string | null; exhibitor_tier: string | null };
type Connect = { id: string; brand_id: string; title: string; status: string; scheduled_at: string; created_at: string };

function BrandLogo({ name, logoUrl, size = 40 }: { name: string; logoUrl?: string | null; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (logoUrl) {
    return <img src={logoUrl} alt={name} style={{ width: size, height: size, minWidth: size, maxWidth: size, borderRadius: 10, objectFit: "contain", border: "1px solid #e2e8f0", background: "white" }} />;
  }
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#1e293b", color: "white", fontSize: size * 0.26, fontWeight: 600 }}>
      {initials}
    </div>
  );
}

export default function SpeedConnectPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [connects, setConnects] = useState<Connect[]>([]);
  const [booking, setBooking] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Load matched brands and statuses
      const dashRes = await fetch("/api/dashboard?type=summary");
      const dashData = await dashRes.json();
      setBrands(dashData.brands ?? []);
      setStatusMap(dashData.statusMap ?? {});

      // Load existing speed connects
      const scRes = await fetch("/api/dashboard/speed-connect");
      const scData = await scRes.json();
      setConnects(scData.connects ?? []);

      setLoading(false);
    }
    load();
  }, []);

  async function requestConnect(brand: Brand) {
    setBooking(brand.id);

    // Track the speed connect request
    await fetch("/api/dashboard/speed-connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId: brand.id, brandName: brand.name }),
    });

    // Refresh connects list
    const scRes = await fetch("/api/dashboard/speed-connect");
    const scData = await scRes.json();
    setConnects(scData.connects ?? []);

    // Open Calendly link
    if (brand.calendly_link) {
      window.open(brand.calendly_link, "_blank");
    }

    setBooking(null);
  }

  async function cancelConnect(connectId: string) {
    await fetch("/api/dashboard/speed-connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", eventId: connectId }),
    });
    setConnects((prev) => prev.map((c) => c.id === connectId ? { ...c, status: "cancelled" } : c));
  }

  // Sort brands: interested first, then those with Calendly links
  const connectBrandIds = new Set(connects.filter((c) => c.status === "scheduled").map((c) => c.brand_id));
  const interestedBrands = brands.filter((b) => statusMap[b.id] === "interested" && !connectBrandIds.has(b.id));
  const otherBrands = brands.filter((b) => statusMap[b.id] !== "interested" && !connectBrandIds.has(b.id) && statusMap[b.id] !== "not_interested");
  const availableBrands = [...interestedBrands, ...otherBrands].filter((b) => b.calendly_link);
  const noCaldendlyBrands = [...interestedBrands, ...otherBrands].filter((b) => !b.calendly_link);

  const activeConnects = connects.filter((c) => c.status === "scheduled");
  const pastConnects = connects.filter((c) => c.status !== "scheduled");

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading speed connects...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-lg font-semibold">Speed Connect</h1>
      <p className="mt-1 text-sm text-slate-500">10-minute 1-on-1 video sessions with franchise development reps.</p>

      {/* How it works */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900 mb-2">How Speed Connect works</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <div>
            <p className="text-xs font-semibold text-amber-800">1. Choose a brand</p>
            <p className="text-xs text-amber-700 mt-1">Select from your interested or matched brands below.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">2. Book via Calendly</p>
            <p className="text-xs text-amber-700 mt-1">Pick a time that works. The brand's Calendly opens in a new tab.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">3. Have the call</p>
            <p className="text-xs text-amber-700 mt-1">10 minutes. Your questions only. No sales pitch required.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">4. You control follow-up</p>
            <p className="text-xs text-amber-700 mt-1">No brand can follow up more than twice without your invitation.</p>
          </div>
        </div>
      </div>

      {/* Active connects */}
      {activeConnects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3">Your scheduled connects</h2>
          <div className="space-y-2">
            {activeConnects.map((c) => {
              const brand = brands.find((b) => b.id === c.brand_id);
              return (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
                  <div className="flex items-center gap-3">
                    {brand && <BrandLogo name={brand.name} logoUrl={brand.logo_url} size={36} />}
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-slate-500">Requested {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Scheduled</span>
                    {brand?.calendly_link && (
                      <a href={brand.calendly_link} target="_blank" rel="noopener noreferrer"
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-300 hover:bg-amber-200">
                        Reschedule ↗
                      </a>
                    )}
                    <button onClick={() => cancelConnect(c.id)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-red-100 hover:text-red-600 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available brands with Calendly */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Available brands</h2>
          <span className="text-xs text-slate-400">{availableBrands.length} brands with scheduling available</span>
        </div>
        {availableBrands.length === 0 && noCaldendlyBrands.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No brands available for speed connects yet. Mark brands as "Interested" to see them here.
          </div>
        ) : (
          <div className="space-y-3">
            {availableBrands.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <BrandLogo name={b.name} logoUrl={b.logo_url} size={40} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{b.name}</p>
                      {statusMap[b.id] === "interested" && (
                        <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>INTERESTED</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{b.category}</p>
                  </div>
                </div>
                <button onClick={() => requestConnect(b)} disabled={booking === b.id}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition">
                  {booking === b.id ? "Opening..." : "Book speed connect →"}
                </button>
              </div>
            ))}

            {/* Brands without Calendly */}
            {noCaldendlyBrands.length > 0 && (
              <>
                <p className="text-xs text-slate-400 mt-4 mb-2">These brands haven't set up scheduling yet:</p>
                {noCaldendlyBrands.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 opacity-70">
                    <div className="flex items-center gap-3">
                      <BrandLogo name={b.name} logoUrl={b.logo_url} size={36} />
                      <div>
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-slate-400">{b.category}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Scheduling not available yet</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Past connects */}
      {pastConnects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3">Past connects</h2>
          <div className="space-y-2">
            {pastConnects.map((c) => {
              const brand = brands.find((b) => b.id === c.brand_id);
              return (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-5 py-3">
                  <div className="flex items-center gap-3">
                    {brand && <BrandLogo name={brand.name} logoUrl={brand.logo_url} size={32} />}
                    <div>
                      <p className="text-sm font-medium text-slate-600">{c.title}</p>
                      <p className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${c.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
