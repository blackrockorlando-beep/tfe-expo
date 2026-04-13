"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STEPS = [
  "Brand basics", "Investment & financials", "Item 19", "Operations",
  "Territory", "Support model", "Contact & pitch", "Documents", "Franchisee validation",
];

const CATEGORIES = [
  "Health & beauty", "Food & beverage", "Home services",
  "Fitness & wellness", "B2B services", "Pet services",
  "Education & tutoring", "Retail",
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
type Document = { title: string; description: string; access_type: "Download" | "Request access"; file_url?: string };
type PnlRow = { label: string; amount: number; pct: number; color: string };
type Validation = { initials: string; name: string; location: string; months_open: number; quote: string; rating: number };

export default function EditFranchisorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [exhibitorTier, setExhibitorTier] = useState("exhibitor");
  const [description, setDescription] = useState("");
  const [ownershipModel, setOwnershipModel] = useState("");
  const [tags, setTags] = useState("");
  const [overview, setOverview] = useState("");

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
  const [calendlyLink, setCalendlyLink] = useState("");

  const [documents, setDocuments] = useState<Document[]>([]);
  const [validations, setValidations] = useState<Validation[]>([]);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/admin/brands/${id}`);
        const data = await res.json() as { brand: Record<string, unknown> };
        const b = data.brand;

        setName(b.name as string ?? "");
        setLogoUrl(b.logo_url as string ?? "");
        setHeroImageUrl(b.hero_image_url as string ?? "");
        setSlug(b.slug as string ?? "");
        setCategory(b.category as string ?? "");
        setExhibitorTier(b.exhibitor_tier as string ?? "exhibitor");
        setDescription(b.description as string ?? "");
        setOwnershipModel(b.ownership_model as string ?? "");
        setTags((b.tags as string[] ?? []).join(", "));
        setOverview(b.overview as string ?? "");
        setInvestmentMin(String(b.investment_min ?? ""));
        setInvestmentMax(String(b.investment_max ?? ""));
        setFranchiseFee(String(b.franchise_fee ?? ""));
        setRoyaltyPct(String(b.royalty_pct ?? ""));
        setAuv(String(b.auv ?? ""));
        setPaybackPeriod(b.payback_period as string ?? "");
        setLiquidCapital(String(b.liquid_capital_required ?? ""));
        setSbaEligible(b.sba_eligible as boolean ?? false);
        setItem19Present(b.item19_present as boolean ?? false);
        setItem19FiscalYear(b.item19_fiscal_year as string ?? "");
        setItem19LocationsReporting(String(b.item19_locations_reporting ?? ""));
        setItem19Summary(b.item19_summary as string ?? "");
        setItem19MedianGross(String(b.item19_median_gross ?? ""));
        setItem19TopQuartile(String(b.item19_top_quartile_gross ?? ""));
        setItem19BottomQuartile(String(b.item19_bottom_quartile_gross ?? ""));
        setItem19AvgNet(String(b.item19_avg_net_revenue ?? ""));
        setItem19Notes(b.item19_notes as string ?? "");
        setPnlRows([
          { label: "Cost of goods / supplies", amount: b.item19_cogs_amount as number ?? 0, pct: b.item19_cogs_pct as number ?? 0, color: "#f87171" },
          { label: "Labor / commissions", amount: b.item19_artist_commissions_amount as number ?? 0, pct: b.item19_artist_commissions_pct as number ?? 0, color: "#f87171" },
          { label: "Rent + occupancy", amount: b.item19_rent_amount as number ?? 0, pct: b.item19_rent_pct as number ?? 0, color: "#f87171" },
          { label: "Royalty + marketing fees", amount: b.item19_royalty_amount as number ?? 0, pct: b.item19_royalty_pct as number ?? 0, color: "#f87171" },
          { label: "Other operating expenses", amount: b.item19_other_expenses_amount as number ?? 0, pct: b.item19_other_expenses_pct as number ?? 0, color: "#f87171" },
          { label: "Owner earnings (EBITDA)", amount: b.item19_owner_earnings_amount as number ?? 0, pct: b.item19_owner_earnings_pct as number ?? 0, color: "#10b981" },
        ]);
        setLocationType(b.location_type as string ?? "");
        setOperatingHours(b.operating_hours as string ?? "");
        setStaffAtOpen(b.staff_at_open as string ?? "");
        setRevenueMix(b.revenue_mix as string ?? "");
        setUnitCount(String(b.unit_count ?? ""));
        setYearsFranchising(b.years_franchising as string ?? "");
        setTerritoryDescription(b.territory_description as string ?? "");
        setOnthejobHours(String(b.support_onthejob_hours ?? ""));
        setClassroomHours(String(b.support_classroom_hours ?? ""));
        setRepName(b.rep_name as string ?? "");
        setRepTitle(b.rep_title as string ?? "");
        setRepAvailability(b.rep_availability as string ?? "");
        setPitchTime(b.pitch_time as string ?? "");
        setPitchStage(b.pitch_stage as string ?? "");
        setPitchDuration(b.pitch_duration as string ?? "");
        setCalendlyLink(b.calendly_link as string ?? "");

        const terrs = b.territories as { territory_name: string; status: string }[] ?? [];
        setTerritories(terrs.length ? terrs.map((t) => ({ name: t.territory_name, status: t.status as Territory["status"] })) : [{ name: "", status: "Open" }]);

        const svs = b.support_values as { provided: boolean; support_items: { item_name: string; support_type: string } }[] ?? [];
        const ongoing: string[] = [];
        const marketing: string[] = [];
        svs.forEach((sv) => {
          if (sv.provided) {
            if (sv.support_items.support_type === "ongoing") ongoing.push(sv.support_items.item_name);
            else marketing.push(sv.support_items.item_name);
          }
        });
        setOngoingSupport(ongoing);
        setMarketingSupport(marketing);

        const docs = b.documents as Document[] ?? [];
        setDocuments(docs.length ? docs : []);

        const vals = b.franchisee_validations as Validation[] ?? [];
        setValidations(vals.length ? vals : []);
      } catch (err) {
        setError("Failed to load brand.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [id]);

  function toggleSupport(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brandId", id);
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
    if (!file) return;
    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brandId", id);
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
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, slug, category, exhibitorTier, description, ownershipModel,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          overview, investmentMin: Number(investmentMin), investmentMax: Number(investmentMax),
          franchiseFee: Number(franchiseFee), royaltyPct: Number(royaltyPct),
          auv: Number(auv), paybackPeriod, liquidCapital: Number(liquidCapital), sbaEligible,
          item19Present, item19FiscalYear, item19LocationsReporting: Number(item19LocationsReporting),
          item19Summary, item19MedianGross: Number(item19MedianGross),
          item19TopQuartile: Number(item19TopQuartile), item19BottomQuartile: Number(item19BottomQuartile),
          item19AvgNet: Number(item19AvgNet), item19Notes, pnlRows,
          locationType, operatingHours, staffAtOpen, revenueMix,
          unitCount: Number(unitCount), yearsFranchising, territoryDescription,
          territories: territories.filter((t) => t.name.trim()),
          onthejobHours: Number(onthejobHours), classroomHours: Number(classroomHours),
          ongoingSupport, marketingSupport, repName, repTitle, repAvailability,
          pitchTime, pitchStage, pitchDuration, calendlyLink,
          documents: documents.filter((d) => d.title.trim()),
          validations: validations.filter((v) => v.name.trim()),
        }),
      });
      const result = await res.json() as { error?: string };
      if (!res.ok) throw new Error(result.error ?? "Failed to save.");
      setSuccessMsg("Saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-sm text-slate-400">Loading...</p></div>;

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Edit franchisor</h1>
          <p className="mt-1 text-sm text-slate-500">{name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/dashboard/pavilion/${id}`)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">View pavilion →</button>
          <button onClick={() => router.push("/admin/franchisors")} className="text-sm text-slate-500 hover:text-slate-900">Back to list</button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm transition ${step === i ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Brand basics</h2>

            <div>
              <label className={labelClass}>Brand logo</label>
              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <img src={logoUrl} alt="Logo" className="h-16 w-16 rounded-lg object-contain border border-slate-200" />
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

            <div>
              <label className={labelClass}>Brand hero photo</label>
              {heroImageUrl ? (
                <div className="flex items-center gap-4">
                  <img src={heroImageUrl} alt="Hero" className="h-32 w-full max-w-md rounded-lg object-cover border border-slate-200" />
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
            <div><label className={labelClass}>URL slug</label><input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
            <div><label className={labelClass}>Category</label><select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div>
              <label className={labelClass}>Exhibitor tier</label>
              <select className={inputClass} value={exhibitorTier} onChange={(e) => setExhibitorTier(e.target.value)}>
                <option value="exhibitor">Exhibitor — $1,500</option>
                <option value="featured">Featured — $2,500</option>
                <option value="title_sponsor">Title Sponsor — $5,000</option>
              </select>
            </div>
            <div><label className={labelClass}>Ownership model</label><select className={inputClass} value={ownershipModel} onChange={(e) => setOwnershipModel(e.target.value)}>{OWNERSHIP_MODELS.map((m) => <option key={m}>{m}</option>)}</select></div>
            <div><label className={labelClass}>Tags (comma-separated)</label><input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} /></div>
            <div><label className={labelClass}>Brand description</label><textarea className={`${inputClass} h-28 resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div><label className={labelClass}>Full overview (pavilion)</label><textarea className={`${inputClass} h-36 resize-none`} value={overview} onChange={(e) => setOverview(e.target.value)} /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Investment & financials</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Investment minimum ($)</label><input type="number" className={inputClass} value={investmentMin} onChange={(e) => setInvestmentMin(e.target.value)} /></div>
              <div><label className={labelClass}>Investment maximum ($)</label><input type="number" className={inputClass} value={investmentMax} onChange={(e) => setInvestmentMax(e.target.value)} /></div>
              <div><label className={labelClass}>Franchise fee ($)</label><input type="number" className={inputClass} value={franchiseFee} onChange={(e) => setFranchiseFee(e.target.value)} /></div>
              <div><label className={labelClass}>Royalty (%)</label><input type="number" className={inputClass} value={royaltyPct} onChange={(e) => setRoyaltyPct(e.target.value)} /></div>
              <div><label className={labelClass}>AUV ($)</label><input type="number" className={inputClass} value={auv} onChange={(e) => setAuv(e.target.value)} /></div>
              <div><label className={labelClass}>Payback period</label><input className={inputClass} value={paybackPeriod} onChange={(e) => setPaybackPeriod(e.target.value)} /></div>
              <div><label className={labelClass}>Liquid capital required ($)</label><input type="number" className={inputClass} value={liquidCapital} onChange={(e) => setLiquidCapital(e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-3"><input type="checkbox" id="sba" checked={sbaEligible} onChange={(e) => setSbaEligible(e.target.checked)} className="rounded" /><label htmlFor="sba" className="text-sm text-slate-700">SBA eligible</label></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Item 19 — earnings</h2>
            <div className="flex items-center gap-3"><input type="checkbox" id="item19" checked={item19Present} onChange={(e) => setItem19Present(e.target.checked)} className="rounded" /><label htmlFor="item19" className="text-sm text-slate-700">Item 19 present in FDD</label></div>
            {item19Present && (
              <>
                <div className="grid grid-cols-2 gap-5">
                  <div><label className={labelClass}>Fiscal year</label><input className={inputClass} value={item19FiscalYear} onChange={(e) => setItem19FiscalYear(e.target.value)} /></div>
                  <div><label className={labelClass}>Locations reporting</label><input type="number" className={inputClass} value={item19LocationsReporting} onChange={(e) => setItem19LocationsReporting(e.target.value)} /></div>
                  <div><label className={labelClass}>Median gross ($)</label><input type="number" className={inputClass} value={item19MedianGross} onChange={(e) => setItem19MedianGross(e.target.value)} /></div>
                  <div><label className={labelClass}>Top quartile gross ($)</label><input type="number" className={inputClass} value={item19TopQuartile} onChange={(e) => setItem19TopQuartile(e.target.value)} /></div>
                  <div><label className={labelClass}>Bottom quartile gross ($)</label><input type="number" className={inputClass} value={item19BottomQuartile} onChange={(e) => setItem19BottomQuartile(e.target.value)} /></div>
                  <div><label className={labelClass}>Average net revenue ($)</label><input type="number" className={inputClass} value={item19AvgNet} onChange={(e) => setItem19AvgNet(e.target.value)} /></div>
                </div>
                <div><label className={labelClass}>Summary</label><textarea className={`${inputClass} h-24 resize-none`} value={item19Summary} onChange={(e) => setItem19Summary(e.target.value)} /></div>
                <div><label className={labelClass}>Footnote / disclaimer</label><textarea className={`${inputClass} h-24 resize-none`} value={item19Notes} onChange={(e) => setItem19Notes(e.target.value)} /></div>
                <div>
                  <label className={labelClass}>P&L line items</label>
                  <div className="space-y-3">
                    {pnlRows.map((row, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3"><label className={labelClass}>Label</label><input className={inputClass} value={row.label} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], label: e.target.value }; setPnlRows(u); }} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className={labelClass}>Amount ($)</label><input type="number" className={inputClass} value={row.amount || ""} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], amount: Number(e.target.value) }; setPnlRows(u); }} /></div>
                          <div><label className={labelClass}>% of gross</label><input type="number" className={inputClass} value={row.pct || ""} onChange={(e) => { const u = [...pnlRows]; u[i] = { ...u[i], pct: Number(e.target.value) }; setPnlRows(u); }} /></div>
                        </div>
                        <button type="button" onClick={() => setPnlRows(pnlRows.filter((_, j) => j !== i))} className="mt-2 text-xs text-slate-400 hover:text-red-500">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setPnlRows([...pnlRows, { label: "", amount: 0, pct: 0, color: "#f87171" }])} className="text-sm text-amber-600 hover:underline">+ Add line item</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Operations overview</h2>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Location type</label><input className={inputClass} value={locationType} onChange={(e) => setLocationType(e.target.value)} /></div>
              <div><label className={labelClass}>Operating hours</label><input className={inputClass} value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} /></div>
              <div><label className={labelClass}>Staff at open</label><input className={inputClass} value={staffAtOpen} onChange={(e) => setStaffAtOpen(e.target.value)} /></div>
              <div><label className={labelClass}>Revenue mix</label><input className={inputClass} value={revenueMix} onChange={(e) => setRevenueMix(e.target.value)} /></div>
              <div><label className={labelClass}>Units open</label><input type="number" className={inputClass} value={unitCount} onChange={(e) => setUnitCount(e.target.value)} /></div>
              <div><label className={labelClass}>Years franchising</label><input className={inputClass} value={yearsFranchising} onChange={(e) => setYearsFranchising(e.target.value)} /></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Territory</h2>
            <div><label className={labelClass}>Territory description</label><textarea className={`${inputClass} h-24 resize-none`} value={territoryDescription} onChange={(e) => setTerritoryDescription(e.target.value)} /></div>
            <div>
              <label className={labelClass}>Available territories</label>
              <div className="space-y-3">
                {territories.map((t, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3"><label className={labelClass}>Territory name</label><input className={inputClass} value={t.name} onChange={(e) => { const u = [...territories]; u[i] = { ...u[i], name: e.target.value }; setTerritories(u); }} /></div>
                    <div className="flex items-center justify-between">
                      <div className="w-48"><label className={labelClass}>Status</label><select className={inputClass} value={t.status} onChange={(e) => { const u = [...territories]; u[i] = { ...u[i], status: e.target.value as Territory["status"] }; setTerritories(u); }}><option>Open</option><option>Limited</option><option>Awarded</option></select></div>
                      <button type="button" onClick={() => setTerritories(territories.filter((_, j) => j !== i))} className="mt-4 text-xs text-slate-400 hover:text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setTerritories([...territories, { name: "", status: "Open" }])} className="text-sm text-amber-600 hover:underline">+ Add territory</button>
              </div>
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
            <div><label className={labelClass}>Ongoing support</label><div className="grid grid-cols-2 gap-2">{SUPPORT_ONGOING.map((item) => (<label key={item} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={ongoingSupport.includes(item)} onChange={() => toggleSupport(item, ongoingSupport, setOngoingSupport)} className="rounded" />{item}</label>))}</div></div>
            <div><label className={labelClass}>Marketing support</label><div className="grid grid-cols-2 gap-2">{SUPPORT_MARKETING.map((item) => (<label key={item} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={marketingSupport.includes(item)} onChange={() => toggleSupport(item, marketingSupport, setMarketingSupport)} className="rounded" />{item}</label>))}</div></div>
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
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="space-y-3">
                    <div><label className={labelClass}>Document title</label><input className={inputClass} value={doc.title} onChange={(e) => { const u = [...documents]; u[i] = { ...u[i], title: e.target.value }; setDocuments(u); }} /></div>
                    <div><label className={labelClass}>Description</label><input className={inputClass} value={doc.description} onChange={(e) => { const u = [...documents]; u[i] = { ...u[i], description: e.target.value }; setDocuments(u); }} /></div>
                    <div><label className={labelClass}>Access type</label><select className={inputClass} value={doc.access_type} onChange={(e) => { const u = [...documents]; u[i] = { ...u[i], access_type: e.target.value as Document["access_type"] }; setDocuments(u); }}><option>Download</option><option>Request access</option></select></div>
                    {doc.file_url && <p className="text-xs text-slate-400">File: {doc.file_url}</p>}
                  </div>
                  <button type="button" onClick={() => setDocuments(documents.filter((_, j) => j !== i))} className="mt-3 text-xs text-slate-400 hover:text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setDocuments([...documents, { title: "", description: "", access_type: "Download" }])} className="text-sm text-amber-600 hover:underline">+ Add document</button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Franchisee validation</h2>
            <div className="space-y-4">
              {validations.map((v, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className={labelClass}>Initials</label><input className={inputClass} value={v.initials} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], initials: e.target.value }; setValidations(u); }} placeholder="JR" /></div>
                    <div><label className={labelClass}>Name</label><input className={inputClass} value={v.name} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], name: e.target.value }; setValidations(u); }} placeholder="Jason R." /></div>
                    <div><label className={labelClass}>Location</label><input className={inputClass} value={v.location} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], location: e.target.value }; setValidations(u); }} placeholder="Orlando, FL" /></div>
                    <div><label className={labelClass}>Months open</label><input type="number" className={inputClass} value={v.months_open || ""} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], months_open: Number(e.target.value) }; setValidations(u); }} /></div>
                    <div><label className={labelClass}>Rating (1–5)</label><input type="number" min={1} max={5} className={inputClass} value={v.rating || ""} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], rating: Number(e.target.value) }; setValidations(u); }} /></div>
                  </div>
                  <div><label className={labelClass}>Quote</label><textarea className={`${inputClass} h-24 resize-none`} value={v.quote} onChange={(e) => { const u = [...validations]; u[i] = { ...u[i], quote: e.target.value }; setValidations(u); }} /></div>
                  <button type="button" onClick={() => setValidations(validations.filter((_, j) => j !== i))} className="mt-3 text-xs text-slate-400 hover:text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => setValidations([...validations, { initials: "", name: "", location: "", months_open: 0, quote: "", rating: 5 }])} className="text-sm text-amber-600 hover:underline">+ Add franchisee</button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {successMsg && <p className="mt-4 text-sm text-emerald-600">{successMsg}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">Back</button>
          <div className="flex gap-3">
            {step < STEPS.length - 1 && (
              <button type="button" onClick={() => setStep((s) => s + 1)}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Next →</button>
            )}
            <button type="button" onClick={handleSave} disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
