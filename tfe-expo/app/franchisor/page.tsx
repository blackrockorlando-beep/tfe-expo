"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Brand basics", "Investment & financials", "Item 19", "Operations",
  "Territory", "Support model", "Contact & pitch", "Documents", "Franchisee validation",
];

const CATEGORIES = [
  "Health & beauty", "Food & beverage", "Home services", "Fitness & wellness",
  "B2B services", "Pet services", "Education & tutoring", "Retail",
];

const OWNERSHIP_MODELS = ["semi-absentee", "owner-operator", "multi-unit"];

const SUPPORT_ONGOING = [
  "Newsletter", "Meetings & Conventions", "Grand Opening", "Online Support",
  "Security & Safety Procedures", "Lease Negotiation", "Field Operations",
  "Site Selection", "Proprietary Software", "Franchisee Intranet Platform",
];

const SUPPORT_MARKETING = [
  "Co-op Advertising", "Ad Templates", "National Media", "Regional Advertising",
  "Social Media", "SEO", "Website Development", "Email Marketing", "Loyalty Program/App",
];

type Territory = { name: string; status: "Open" | "Limited" | "Awarded" };
type PnlRow = { label: string; amount: number; pct: number; color: string };

export default function FranchisorProfilePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);

  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ownershipModel, setOwnershipModel] = useState("");
  const [tags, setTags] = useState("");
  const [overview, setOverview] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");

  const [investmentMin, setInvestmentMin] = useState("");
  const [investmentMax, setInvestmentMax] = useState("");
  const [franchiseFee, setFranchiseFee] = useState("");
  const [royaltyPct, setRoyaltyPct] = useState("");
  const [auv, setAuv] = useState("");
  const [paybackPeriod, setPaybackPeriod] = useState("");
  const [liquidCapital, setLiquidCapital] = useState("");
  const [sbaEligible, setSbaEligible] = useState(false);

  const [item19Present, setItem19Present] = useState(false);
  const [item19FiscalYear, setItem19FiscalYear] = useState("");
  const [item19LocationsReporting, setItem19LocationsReporting] = useState("");
  const [item19Summary, setItem19Summary] = useState("");
  const [item19MedianGross, setItem19MedianGross] = useState("");
  const [item19TopQuartile, setItem19TopQuartile] = useState("");
  const [item19BottomQuartile, setItem19BottomQuartile] = useState("");
  const [item19AvgNet, setItem19AvgNet] = useState("");
  const [item19Notes, setItem19Notes] = useState("");
  const [pnlRows, setPnlRows] = useState<PnlRow[]>([
    { label: "Cost of goods / supplies", amount: 0, pct: 0, color: "#f87171" },
    { label: "Labor / commissions", amount: 0, pct: 0, color: "#f87171" },
    { label: "Rent + occupancy", amount: 0, pct: 0, color: "#f87171" },
    { label: "Royalty + marketing fees", amount: 0, pct: 0, color: "#f87171" },
    { label: "Other operating expenses", amount: 0, pct: 0, color: "#f87171" },
    { label: "Owner earnings (EBITDA)", amount: 0, pct: 0, color: "#10b981" },
  ]);

  const [locationType, setLocationType] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [staffAtOpen, setStaffAtOpen] = useState("");
  const [revenueMix, setRevenueMix] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [yearsFranchising, setYearsFranchising] = useState("");

  const [territoryDescription, setTerritoryDescription] = useState("");
  const [territories, setTerritories] = useState<Territory[]>([{ name: "", status: "Open" }]);

  const [onthejobHours, setOnthejobHours] = useState("");
  const [classroomHours, setClassroomHours] = useState("");
  const [ongoingSupport, setOngoingSupport] = useState<string[]>([]);
  const [marketingSupport, setMarketingSupport] = useState<string[]>([]);

  const [repName, setRepName] = useState("");
  const [repTitle, setRepTitle] = useState("");
  const [repAvailability, setRepAvailability] = useState("");
  const [pitchTime, setPitchTime] = useState("");
  const [pitchStage, setPitchStage] = useState("");
  const [pitchDuration, setPitchDuration] = useState("");

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch("/api/franchisor/brand");
        if (!res.ok) throw new Error("Unable to load brand.");
        const data = await res.json();
        const b = data.brand;
        if (!b) { setError("No brand assigned to your account."); setLoading(false); return; }

        setBrandId(b.id);
        setName(b.name ?? "");
        setSlug(b.slug ?? "");
        setLogoUrl(b.logo_url ?? "");
        setHeroImageUrl(b.hero_image_url ?? "");
        setCategory(b.category ?? "");
        setDescription(b.description ?? "");
        setOwnershipModel(b.ownership_model ?? "");
        setTags((b.tags ?? []).join(", "));
        setOverview(b.overview ?? "");
        setCalendlyLink(b.calendly_link ?? "");
        setInvestmentMin(String(b.investment_min ?? ""));
        setInvestmentMax(String(b.investment_max ?? ""));
        setFranchiseFee(String(b.franchise_fee ?? ""));
        setRoyaltyPct(String(b.royalty_pct ?? ""));
        setAuv(String(b.auv ?? ""));
        setPaybackPeriod(b.payback_period ?? "");
        setLiquidCapital(String(b.liquid_capital_required ?? ""));
        setSbaEligible(b.sba_eligible ?? false);
        setItem19Present(b.item19_present ?? false);
        setItem19FiscalYear(b.item19_fiscal_year ?? "");
        setItem19LocationsReporting(String(b.item19_locations_reporting ?? ""));
        setItem19Summary(b.item19_summary ?? "");
        setItem19MedianGross(String(b.item19_median_gross ?? ""));
        setItem19TopQuartile(String(b.item19_top_quartile_gross ?? ""));
        setItem19BottomQuartile(String(b.item19_bottom_quartile_gross ?? ""));
        setItem19AvgNet(String(b.item19_avg_net_revenue ?? ""));
        setItem19Notes(b.item19_notes ?? "");
        setLocationType(b.location_type ?? "");
        setOperatingHours(b.operating_hours ?? "");
        setStaffAtOpen(b.staff_at_open ?? "");
        setRevenueMix(b.revenue_mix ?? "");
        setUnitCount(String(b.unit_count ?? ""));
        setYearsFranchising(b.years_franchising ?? "");
        setTerritoryDescription(b.territory_description ?? "");
        setRepName(b.rep_name ?? "");
        setRepTitle(b.rep_title ?? "");
        setRepAvailability(b.rep_availability ?? "");
        setPitchTime(b.pitch_time ?? "");
        setPitchStage(b.pitch_stage ?? "");
        setPitchDuration(b.pitch_duration ?? "");

        if (b.territories?.length) setTerritories(b.territories.map((t: Territory & { territory_name?: string }) => ({ name: t.territory_name ?? t.name ?? "", status: t.status })));
        if (b.item19_pnl?.length) setPnlRows(b.item19_pnl);

        const ongoing: string[] = [];
        const marketing: string[] = [];
        (b.support_values ?? []).forEach((sv: { provided: boolean; support_items: { item_name: string; support_type: string } }) => {
          if (sv.provided && sv.support_items) {
            if (sv.support_items.support_type === "ongoing") ongoing.push(sv.support_items.item_name);
            if (sv.support_items.support_type === "marketing") marketing.push(sv.support_items.item_name);
          }
        });
        setOngoingSupport(ongoing);
        setMarketingSupport(marketing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load brand.");
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, []);

  function toggleSupport(item: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !brandId) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brandId", brandId);
      const res = await fetch("/api/admin/upload-brand-logo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLogoUrl(data.url + "?t=" + Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !brandId) return;
    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brandId", brandId);
      formData.append("type", "hero");
      const res = await fetch("/api/admin/upload-brand-logo", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHeroImageUrl(data.url + "?t=" + Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hero upload failed.");
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/franchisor/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, slug, category, description, ownership_model: ownershipModel,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          overview, calendly_link: calendlyLink,
          investment_min: Number(investmentMin) || null,
          investment_max: Number(investmentMax) || null,
          franchise_fee: Number(franchiseFee) || null,
          royalty_pct: Number(royaltyPct) || null,
          auv: Number(auv) || null, payback_period: paybackPeriod,
          liquid_capital_required: Number(liquidCapital) || null,
          sba_eligible: sbaEligible, item19_present: item19Present,
          item19_fiscal_year: item19FiscalYear,
          item19_locations_reporting: Number(item19LocationsReporting) || null,
          item19_summary: item19Summary,
          item19_median_gross: Number(item19MedianGross) || null,
          item19_top_quartile_gross: Number(item19TopQuartile) || null,
          item19_bottom_quartile_gross: Number(item19BottomQuartile) || null,
          item19_avg_net_revenue: Number(item19AvgNet) || null,
          item19_notes: item19Notes, item19_pnl: pnlRows,
          location_type: locationType, operating_hours: operatingHours,
          staff_at_open: staffAtOpen, revenue_mix: revenueMix,
          unit_count: Number(unitCount) || null, years_franchising: yearsFranchising,
          territory_description: territoryDescription, territories,
          support_ongoing: ongoingSupport, support_marketing: marketingSupport,
          rep_name: repName, rep_title: repTitle, rep_availability: repAvailability,
          pitch_time: pitchTime, pitch_stage: pitchStage, pitch_duration: pitchDuration,
        }),
      });
      if (!res.ok) throw new Error("Save failed.");
      setSuccessMsg("Brand profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "mb-1 block text-sm font-medium text-slate-700";
  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2";

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading brand profile...</div>;
  if (error && !brandId) return <div className="p-8 text-sm text-red-600">{error}</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brand Profile</h1>
        <span className="text-xs text-slate-400">Editing: {name || "New brand"}</span>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${i === step ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Brand basics</h2>

            {/* Logo upload */}
            <div>
              <label className={labelClass}>Brand logo</label>
              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <img src={logoUrl} alt="Logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "contain", border: "1px solid #e2e8f0" }} />
                  <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    Change
                    <input type="file" accept="image/*" className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} onChange={handleLogoUpload} />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
                  {uploadingLogo ? "Uploading..." : "Upload logo (PNG, JPG, SVG)"}
                  <input type="file" accept="image/*" className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
              )}
            </div>

            {/* Hero image upload */}
            <div>
              <label className={labelClass}>Brand hero photo</label>
              {heroImageUrl ? (
                <div className="flex items-center gap-4">
                  <img src={heroImageUrl} alt="Hero" style={{ height: 128, maxWidth: 400, borderRadius: 12, objectFit: "cover", border: "1px solid #e2e8f0" }} />
                  <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    Change
                    <input type="file" accept="image/*" className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} onChange={handleHeroUpload} />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
                  {uploadingHero ? "Uploading..." : "Upload hero photo (storefront, team, product)"}
                  <input type="file" accept="image/*" className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} onChange={handleHeroUpload} disabled={uploadingHero} />
                </label>
              )}
            </div>

            <div><label className={labelClass}>Brand name</label><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Category</label>
                <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className={labelClass}>Ownership model</label>
                <select className={inputClass} value={ownershipModel} onChange={(e) => setOwnershipModel(e.target.value)}>
                  <option value="">Select</option>{OWNERSHIP_MODELS.map((m) => <option key={m}>{m}</option>)}
                </select></div>
            </div>
            <div><label className={labelClass}>Tags (comma-separated)</label><input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} /></div>
            <div><label className={labelClass}>Short description</label><textarea className={`${inputClass} h-20 resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div><label className={labelClass}>Full overview</label><textarea className={`${inputClass} h-32 resize-none`} value={overview} onChange={(e) => setOverview(e.target.value)} /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Investment & financials</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Investment min ($)</label><input type="number" className={inputClass} value={investmentMin} onChange={(e) => setInvestmentMin(e.target.value)} /></div>
              <div><label className={labelClass}>Investment max ($)</label><input type="number" className={inputClass} value={investmentMax} onChange={(e) => setInvestmentMax(e.target.value)} /></div>
              <div><label className={labelClass}>Franchise fee ($)</label><input type="number" className={inputClass} value={franchiseFee} onChange={(e) => setFranchiseFee(e.target.value)} /></div>
              <div><label className={labelClass}>Royalty %</label><input type="number" step="0.1" className={inputClass} value={royaltyPct} onChange={(e) => setRoyaltyPct(e.target.value)} /></div>
              <div><label className={labelClass}>AUV ($)</label><input type="number" className={inputClass} value={auv} onChange={(e) => setAuv(e.target.value)} /></div>
              <div><label className={labelClass}>Payback period</label><input className={inputClass} value={paybackPeriod} onChange={(e) => setPaybackPeriod(e.target.value)} placeholder="18-24 months" /></div>
              <div><label className={labelClass}>Liquid capital required ($)</label><input type="number" className={inputClass} value={liquidCapital} onChange={(e) => setLiquidCapital(e.target.value)} /></div>
              <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sbaEligible} onChange={(e) => setSbaEligible(e.target.checked)} className="rounded" /> SBA eligible</label></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Item 19 Financial Performance</h2>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item19Present} onChange={(e) => setItem19Present(e.target.checked)} className="rounded" /> Item 19 present in FDD</label>
            {item19Present && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div><label className={labelClass}>Fiscal year</label><input className={inputClass} value={item19FiscalYear} onChange={(e) => setItem19FiscalYear(e.target.value)} /></div>
                  <div><label className={labelClass}>Locations reporting</label><input type="number" className={inputClass} value={item19LocationsReporting} onChange={(e) => setItem19LocationsReporting(e.target.value)} /></div>
                  <div><label className={labelClass}>Median gross ($)</label><input type="number" className={inputClass} value={item19MedianGross} onChange={(e) => setItem19MedianGross(e.target.value)} /></div>
                  <div><label className={labelClass}>Top quartile gross ($)</label><input type="number" className={inputClass} value={item19TopQuartile} onChange={(e) => setItem19TopQuartile(e.target.value)} /></div>
                  <div><label className={labelClass}>Bottom quartile gross ($)</label><input type="number" className={inputClass} value={item19BottomQuartile} onChange={(e) => setItem19BottomQuartile(e.target.value)} /></div>
                  <div><label className={labelClass}>Avg net revenue ($)</label><input type="number" className={inputClass} value={item19AvgNet} onChange={(e) => setItem19AvgNet(e.target.value)} /></div>
                </div>
                <div><label className={labelClass}>Summary</label><textarea className={`${inputClass} h-20 resize-none`} value={item19Summary} onChange={(e) => setItem19Summary(e.target.value)} /></div>
                <div><label className={labelClass}>Notes / disclaimers</label><textarea className={`${inputClass} h-20 resize-none`} value={item19Notes} onChange={(e) => setItem19Notes(e.target.value)} /></div>
                <div>
                  <label className={labelClass}>Unit-level P&L breakdown</label>
                  {pnlRows.map((row, i) => (
                    <div key={i} className="mt-2 grid grid-cols-3 gap-3">
                      <input className={inputClass} value={row.label} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], label: e.target.value }; setPnlRows(u); }} placeholder="Label" />
                      <input type="number" className={inputClass} value={row.amount || ""} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], amount: Number(e.target.value) }; setPnlRows(u); }} placeholder="Amount" />
                      <input type="number" step="0.1" className={inputClass} value={row.pct || ""} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], pct: Number(e.target.value) }; setPnlRows(u); }} placeholder="%" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Operations</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Location type</label><input className={inputClass} value={locationType} onChange={(e) => setLocationType(e.target.value)} /></div>
              <div><label className={labelClass}>Operating hours</label><input className={inputClass} value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} /></div>
              <div><label className={labelClass}>Staff at open</label><input className={inputClass} value={staffAtOpen} onChange={(e) => setStaffAtOpen(e.target.value)} /></div>
              <div><label className={labelClass}>Revenue mix</label><input className={inputClass} value={revenueMix} onChange={(e) => setRevenueMix(e.target.value)} /></div>
              <div><label className={labelClass}>Unit count</label><input type="number" className={inputClass} value={unitCount} onChange={(e) => setUnitCount(e.target.value)} /></div>
              <div><label className={labelClass}>Years franchising</label><input className={inputClass} value={yearsFranchising} onChange={(e) => setYearsFranchising(e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Territory</h2>
            <div><label className={labelClass}>Territory description</label><textarea className={`${inputClass} h-20 resize-none`} value={territoryDescription} onChange={(e) => setTerritoryDescription(e.target.value)} /></div>
            <div>
              <label className={labelClass}>Available territories</label>
              {territories.map((t, i) => (
                <div key={i} className="mt-2 flex gap-3">
                  <input className={`${inputClass} flex-1`} value={t.name} onChange={(e) => { const u = [...territories]; u[i] = { ...u[i], name: e.target.value }; setTerritories(u); }} placeholder="Territory name" />
                  <select className={inputClass} style={{ width: "140px" }} value={t.status} onChange={(e) => { const u = [...territories]; u[i] = { ...u[i], status: e.target.value as Territory["status"] }; setTerritories(u); }}>
                    <option>Open</option><option>Limited</option><option>Awarded</option>
                  </select>
                  <button type="button" onClick={() => setTerritories(territories.filter((_, j) => j !== i))} className="text-xs text-slate-400 hover:text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setTerritories([...territories, { name: "", status: "Open" }])} className="mt-2 text-sm text-amber-600 hover:underline">+ Add territory</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold">Support model</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>On-the-job training hours</label><input type="number" className={inputClass} value={onthejobHours} onChange={(e) => setOnthejobHours(e.target.value)} /></div>
              <div><label className={labelClass}>Classroom training hours</label><input type="number" className={inputClass} value={classroomHours} onChange={(e) => setClassroomHours(e.target.value)} /></div>
            </div>
            <div>
              <label className={labelClass}>Ongoing support</label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORT_ONGOING.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={ongoingSupport.includes(item)} onChange={() => toggleSupport(item, ongoingSupport, setOngoingSupport)} className="rounded" />{item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Marketing support</label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORT_MARKETING.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={marketingSupport.includes(item)} onChange={() => toggleSupport(item, marketingSupport, setMarketingSupport)} className="rounded" />{item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Contact & pitch</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Rep name</label><input className={inputClass} value={repName} onChange={(e) => setRepName(e.target.value)} /></div>
              <div><label className={labelClass}>Rep title</label><input className={inputClass} value={repTitle} onChange={(e) => setRepTitle(e.target.value)} /></div>
              <div><label className={labelClass}>Availability</label><input className={inputClass} value={repAvailability} onChange={(e) => setRepAvailability(e.target.value)} /></div>
              <div><label className={labelClass}>Pitch time</label><input className={inputClass} value={pitchTime} onChange={(e) => setPitchTime(e.target.value)} /></div>
              <div><label className={labelClass}>Pitch stage</label><input className={inputClass} value={pitchStage} onChange={(e) => setPitchStage(e.target.value)} /></div>
              <div><label className={labelClass}>Pitch duration</label><input className={inputClass} value={pitchDuration} onChange={(e) => setPitchDuration(e.target.value)} /></div>
            </div>
            <div><label className={labelClass}>Calendly link</label><input className={inputClass} value={calendlyLink} onChange={(e) => setCalendlyLink(e.target.value)} placeholder="https://calendly.com/your-brand" /></div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Documents</h2>
            <p className="text-sm text-slate-500">Document management coming soon. Use admin portal to manage documents.</p>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Franchisee validation</h2>
            <p className="text-sm text-slate-500">Validation management coming soon. Use admin portal to manage validations.</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {successMsg && <p className="mt-4 text-sm text-emerald-600">{successMsg}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
            Back
          </button>
          <div className="flex gap-3">
            {step < STEPS.length - 1 && (
              <button type="button" onClick={() => setStep((s) => s + 1)}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Next →
              </button>
            )}
            <button type="button" onClick={handleSave} disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
