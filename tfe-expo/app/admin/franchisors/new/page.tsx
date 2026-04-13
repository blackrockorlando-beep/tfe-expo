"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Brand basics",
  "Investment & financials",
  "Item 19",
  "Operations",
  "Territory",
  "Support model",
  "Contact & pitch",
  "Documents",
];

const CATEGORIES = [
  "Health & beauty",
  "Food & beverage",
  "Home services",
  "Fitness & wellness",
  "B2B services",
  "Pet services",
  "Education & tutoring",
  "Retail",
];

const OWNERSHIP_MODELS = ["semi-absentee", "owner-operator", "multi-unit"];

const SUPPORT_ONGOING = [
  "Newsletter",
  "Meetings & Conventions",
  "Grand Opening",
  "Online Support",
  "Security & Safety Procedures",
  "Lease Negotiation",
  "Field Operations",
  "Site Selection",
  "Proprietary Software",
  "Franchisee Intranet Platform",
];

const SUPPORT_MARKETING = [
  "Co-op Advertising",
  "Ad Templates",
  "National Media",
  "Regional Advertising",
  "Social Media",
  "SEO",
  "Website Development",
  "Email Marketing",
  "Loyalty Program/App",
];

type Territory = { name: string; status: "Open" | "Limited" | "Awarded" };
type Document = { title: string; description: string; access_type: "Download" | "Request access" };
type PnlRow = { label: string; amount: number; pct: number; color: string };

export default function NewFranchisorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ownershipModel, setOwnershipModel] = useState("");
  const [tags, setTags] = useState("");
  const [overview, setOverview] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const [documents, setDocuments] = useState<Document[]>([
    { title: "", description: "", access_type: "Download" },
  ]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function toggleSupport(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/brands/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, slug, category, description, ownershipModel,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          overview,
          investmentMin: Number(investmentMin),
          investmentMax: Number(investmentMax),
          franchiseFee: Number(franchiseFee),
          royaltyPct: Number(royaltyPct),
          auv: Number(auv),
          paybackPeriod,
          liquidCapital: Number(liquidCapital),
          sbaEligible,
          item19Present, item19FiscalYear,
          item19LocationsReporting: Number(item19LocationsReporting),
          item19Summary,
          item19MedianGross: Number(item19MedianGross),
          item19TopQuartile: Number(item19TopQuartile),
          item19BottomQuartile: Number(item19BottomQuartile),
          item19AvgNet: Number(item19AvgNet),
          item19Notes, pnlRows,
          locationType, operatingHours, staffAtOpen, revenueMix,
          unitCount: Number(unitCount), yearsFranchising,
          territoryDescription,
          territories: territories.filter((t) => t.name.trim()),
          onthejobHours: Number(onthejobHours),
          classroomHours: Number(classroomHours),
          ongoingSupport, marketingSupport,
          repName, repTitle, repAvailability,
          pitchTime, pitchStage, pitchDuration,
          documents: documents.filter((d) => d.title.trim()),
        }),
      });
      const result = await res.json() as { brandId?: string; error?: string };
      if (!res.ok) throw new Error(result.error ?? "Failed to create brand.");
      router.push("/admin/franchisors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Add new franchisor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>
        <button onClick={() => router.push("/admin/franchisors")} className="text-sm text-slate-500 hover:text-slate-900">
          Cancel
        </button>
      </div>

      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-slate-900" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Brand basics</h2>
            <div>
              <label className={labelClass}>Brand logo</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">No logo</div>
                )}
                <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm text-slate-600" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Brand name</label>
              <input className={inputClass} value={name} onChange={(e) => { setName(e.target.value); setSlug(autoSlug(e.target.value)); }} placeholder="e.g. Fine Ink Studios" />
            </div>
            <div>
              <label className={labelClass}>URL slug</label>
              <input className={inputClass} value={slug} onChange={(e) => setSlug(autoSlug(e.target.value))} placeholder="e.g. fine-ink-studios" />
              <p className="mt-1 text-xs text-slate-400">Auto-generated from name. Used in pavilion URL.</p>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ownership model</label>
              <select className={inputClass} value={ownershipModel} onChange={(e) => setOwnershipModel(e.target.value)}>
                <option value="" disabled>Select a model</option>
                {OWNERSHIP_MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags</label>
              <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. Tattoo & piercing, personal services, semi-absentee" />
              <p className="mt-1 text-xs text-slate-400">Comma-separated. Shown under brand name in pavilion header.</p>
            </div>
            <div>
              <label className={labelClass}>Brand description</label>
              <textarea className={`${inputClass} h-28 resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description shown in search results and brand cards." />
            </div>
            <div>
              <label className={labelClass}>Full overview (pavilion)</label>
              <textarea className={`${inputClass} h-36 resize-none`} value={overview} onChange={(e) => setOverview(e.target.value)} placeholder="Full paragraph shown on the Overview tab of the pavilion page." />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Investment & financials</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Investment minimum ($)</label>
                <input type="number" className={inputClass} value={investmentMin} onChange={(e) => setInvestmentMin(e.target.value)} placeholder="127000" />
              </div>
              <div>
                <label className={labelClass}>Investment maximum ($)</label>
                <input type="number" className={inputClass} value={investmentMax} onChange={(e) => setInvestmentMax(e.target.value)} placeholder="185000" />
              </div>
              <div>
                <label className={labelClass}>Franchise fee ($)</label>
                <input type="number" className={inputClass} value={franchiseFee} onChange={(e) => setFranchiseFee(e.target.value)} placeholder="35000" />
              </div>
              <div>
                <label className={labelClass}>Royalty (%)</label>
                <input type="number" className={inputClass} value={royaltyPct} onChange={(e) => setRoyaltyPct(e.target.value)} placeholder="6" />
              </div>
              <div>
                <label className={labelClass}>Average unit volume / AUV ($)</label>
                <input type="number" className={inputClass} value={auv} onChange={(e) => setAuv(e.target.value)} placeholder="552000" />
              </div>
              <div>
                <label className={labelClass}>Average payback period</label>
                <input className={inputClass} value={paybackPeriod} onChange={(e) => setPaybackPeriod(e.target.value)} placeholder="18–24 mo" />
              </div>
              <div>
                <label className={labelClass}>Liquid capital required ($)</label>
                <input type="number" className={inputClass} value={liquidCapital} onChange={(e) => setLiquidCapital(e.target.value)} placeholder="80000" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sba" checked={sbaEligible} onChange={(e) => setSbaEligible(e.target.checked)} className="rounded" />
              <label htmlFor="sba" className="text-sm text-slate-700">SBA eligible</label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Item 19 — earnings</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="item19" checked={item19Present} onChange={(e) => setItem19Present(e.target.checked)} className="rounded" />
              <label htmlFor="item19" className="text-sm text-slate-700">Item 19 is present in FDD</label>
            </div>
            {item19Present && (
              <>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Fiscal year</label>
                    <input className={inputClass} value={item19FiscalYear} onChange={(e) => setItem19FiscalYear(e.target.value)} placeholder="2023" />
                  </div>
                  <div>
                    <label className={labelClass}>Locations reporting</label>
                    <input type="number" className={inputClass} value={item19LocationsReporting} onChange={(e) => setItem19LocationsReporting(e.target.value)} placeholder="14" />
                  </div>
                  <div>
                    <label className={labelClass}>Median gross revenue ($)</label>
                    <input type="number" className={inputClass} value={item19MedianGross} onChange={(e) => setItem19MedianGross(e.target.value)} placeholder="531000" />
                  </div>
                  <div>
                    <label className={labelClass}>Top quartile gross ($)</label>
                    <input type="number" className={inputClass} value={item19TopQuartile} onChange={(e) => setItem19TopQuartile(e.target.value)} placeholder="748000" />
                  </div>
                  <div>
                    <label className={labelClass}>Bottom quartile gross ($)</label>
                    <input type="number" className={inputClass} value={item19BottomQuartile} onChange={(e) => setItem19BottomQuartile(e.target.value)} placeholder="312000" />
                  </div>
                  <div>
                    <label className={labelClass}>Average net revenue ($)</label>
                    <input type="number" className={inputClass} value={item19AvgNet} onChange={(e) => setItem19AvgNet(e.target.value)} placeholder="138000" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Item 19 summary</label>
                  <textarea className={`${inputClass} h-24 resize-none`} value={item19Summary} onChange={(e) => setItem19Summary(e.target.value)} placeholder="Brief description of what the Item 19 covers..." />
                </div>
                <div>
                  <label className={labelClass}>Item 19 footnote / disclaimer</label>
                  <textarea className={`${inputClass} h-24 resize-none`} value={item19Notes} onChange={(e) => setItem19Notes(e.target.value)} placeholder="Past performance does not guarantee future results..." />
                </div>
                <div>
                  <label className={labelClass}>P&L line items</label>
                  <p className="mb-3 text-xs text-slate-400">Enter amount and percentage of gross revenue for each line.</p>
                  <div className="space-y-3">
                    {pnlRows.map((row, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3">
                          <label className={labelClass}>Line item label</label>
                          <input
                            className={inputClass}
                            value={row.label}
                            onChange={(e) => {
                              const updated = [...pnlRows];
                              updated[i] = { ...updated[i], label: e.target.value };
                              setPnlRows(updated);
                            }}
                            placeholder="e.g. Cost of goods / supplies"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Amount ($)</label>
                            <input
                              type="number"
                              className={inputClass}
                              value={row.amount || ""}
                              onChange={(e) => {
                                const updated = [...pnlRows];
                                updated[i] = { ...updated[i], amount: Number(e.target.value) };
                                setPnlRows(updated);
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className={labelClass}>% of gross revenue</label>
                            <input
                              type="number"
                              className={inputClass}
                              value={row.pct || ""}
                              onChange={(e) => {
                                const updated = [...pnlRows];
                                updated[i] = { ...updated[i], pct: Number(e.target.value) };
                                setPnlRows(updated);
                              }}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPnlRows(pnlRows.filter((_, j) => j !== i))}
                          className="mt-2 text-xs text-slate-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPnlRows([...pnlRows, { label: "", amount: 0, pct: 0, color: "#f87171" }])}
                      className="text-sm text-amber-600 hover:underline"
                    >
                      + Add line item
                    </button>
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
              <div>
                <label className={labelClass}>Location type</label>
                <input className={inputClass} value={locationType} onChange={(e) => setLocationType(e.target.value)} placeholder="Strip mall end-cap · 1,200–1,800 sq ft" />
              </div>
              <div>
                <label className={labelClass}>Operating hours</label>
                <input className={inputClass} value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} placeholder="11am–9pm daily · 7 days" />
              </div>
              <div>
                <label className={labelClass}>Staff at open</label>
                <input className={inputClass} value={staffAtOpen} onChange={(e) => setStaffAtOpen(e.target.value)} placeholder="8–12 artists + 1–2 front desk" />
              </div>
              <div>
                <label className={labelClass}>Revenue mix</label>
                <input className={inputClass} value={revenueMix} onChange={(e) => setRevenueMix(e.target.value)} placeholder="Tattoo 72% · Piercing 21% · Retail 7%" />
              </div>
              <div>
                <label className={labelClass}>Units open</label>
                <input type="number" className={inputClass} value={unitCount} onChange={(e) => setUnitCount(e.target.value)} placeholder="20" />
              </div>
              <div>
                <label className={labelClass}>Years franchising</label>
                <input className={inputClass} value={yearsFranchising} onChange={(e) => setYearsFranchising(e.target.value)} placeholder="Since 2022" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Territory</h2>
            <div>
              <label className={labelClass}>Territory description</label>
              <textarea className={`${inputClass} h-24 resize-none`} value={territoryDescription} onChange={(e) => setTerritoryDescription(e.target.value)} placeholder="Protected territories defined by 3-mile radius..." />
            </div>
            <div>
              <label className={labelClass}>Available territories</label>
              <div className="space-y-3">
                {territories.map((t, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3">
                      <label className={labelClass}>Territory name</label>
                      <input
                        className={inputClass}
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...territories];
                          updated[i] = { ...updated[i], name: e.target.value };
                          setTerritories(updated);
                        }}
                        placeholder="e.g. Tampa Bay metro"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-48">
                        <label className={labelClass}>Status</label>
                        <select
                          className={inputClass}
                          value={t.status}
                          onChange={(e) => {
                            const updated = [...territories];
                            updated[i] = { ...updated[i], status: e.target.value as Territory["status"] };
                            setTerritories(updated);
                          }}
                        >
                          <option>Open</option>
                          <option>Limited</option>
                          <option>Awarded</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTerritories(territories.filter((_, j) => j !== i))}
                        className="mt-4 text-xs text-slate-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setTerritories([...territories, { name: "", status: "Open" }])}
                  className="text-sm text-amber-600 hover:underline"
                >
                  + Add territory
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold">Support model</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>On-the-job training hours</label>
                <input type="number" className={inputClass} value={onthejobHours} onChange={(e) => setOnthejobHours(e.target.value)} placeholder="100" />
              </div>
              <div>
                <label className={labelClass}>Classroom training hours</label>
                <input type="number" className={inputClass} value={classroomHours} onChange={(e) => setClassroomHours(e.target.value)} placeholder="40" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Ongoing support</label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORT_ONGOING.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={ongoingSupport.includes(item)} onChange={() => toggleSupport(item, ongoingSupport, setOngoingSupport)} className="rounded" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Marketing support</label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORT_MARKETING.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={marketingSupport.includes(item)} onChange={() => toggleSupport(item, marketingSupport, setMarketingSupport)} className="rounded" />
                    {item}
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
              <div>
                <label className={labelClass}>Rep name</label>
                <input className={inputClass} value={repName} onChange={(e) => setRepName(e.target.value)} placeholder="Myranda T." />
              </div>
              <div>
                <label className={labelClass}>Rep title</label>
                <input className={inputClass} value={repTitle} onChange={(e) => setRepTitle(e.target.value)} placeholder="Director of Booking · Fine Ink Studios" />
              </div>
              <div>
                <label className={labelClass}>Availability</label>
                <input className={inputClass} value={repAvailability} onChange={(e) => setRepAvailability(e.target.value)} placeholder="Available today" />
              </div>
              <div>
                <label className={labelClass}>Pitch time</label>
                <input className={inputClass} value={pitchTime} onChange={(e) => setPitchTime(e.target.value)} placeholder="Today · 2:30pm ET" />
              </div>
              <div>
                <label className={labelClass}>Pitch stage</label>
                <input className={inputClass} value={pitchStage} onChange={(e) => setPitchStage(e.target.value)} placeholder="Stage 3" />
              </div>
              <div>
                <label className={labelClass}>Pitch duration</label>
                <input className={inputClass} value={pitchDuration} onChange={(e) => setPitchDuration(e.target.value)} placeholder="30 min · live Q&A included" />
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold">Documents</h2>
            <p className="text-sm text-slate-500">
              Add document titles and descriptions. Upload actual files via Supabase Storage after saving — paste the URL into the brand documents table.
            </p>
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Document title</label>
                      <input
                        className={inputClass}
                        value={doc.title}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[i] = { ...updated[i], title: e.target.value };
                          setDocuments(updated);
                        }}
                        placeholder="Franchise Disclosure Document (FDD)"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <input
                        className={inputClass}
                        value={doc.description}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[i] = { ...updated[i], description: e.target.value };
                          setDocuments(updated);
                        }}
                        placeholder="March 2025 · 287 pages · includes Item 19"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Access type</label>
                      <select
                        className={inputClass}
                        value={doc.access_type}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[i] = { ...updated[i], access_type: e.target.value as Document["access_type"] };
                          setDocuments(updated);
                        }}
                      >
                        <option>Download</option>
                        <option>Request access</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocuments(documents.filter((_, j) => j !== i))}
                    className="mt-3 text-xs text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDocuments([...documents, { title: "", description: "", access_type: "Download" }])}
                className="text-sm text-amber-600 hover:underline"
              >
                + Add document
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save franchisor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}