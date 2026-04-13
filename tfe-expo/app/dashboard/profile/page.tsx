"use client";

import { useEffect, useState } from "react";

const INVESTMENT_STEPS = [80, 150, 200, 250, 300, 350, 400, 500, 650];
const BACKGROUNDS = [
  { value: "corporate", label: "Corporate / executive" },
  { value: "entrepreneur", label: "Entrepreneur / business owner" },
  { value: "military", label: "Military veteran" },
  { value: "sales", label: "Sales / business development" },
  { value: "finance", label: "Finance / accounting" },
  { value: "other", label: "Other background" },
];
const OWNERSHIP_MODELS = [
  { value: "semi-absentee", label: "Semi-absentee" },
  { value: "owner-operator", label: "Owner-operator" },
  { value: "multi-unit", label: "Multi-unit" },
  { value: "open", label: "Open to either" },
];
const CATEGORIES = [
  "Health & beauty", "Food & beverage", "Home services", "Fitness & wellness",
  "Retail", "B2B services", "Pet services", "Education & tutoring",
];
const TIMELINES = [
  { value: "within-3-months", label: "Within 3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "12-plus-months", label: "12+ months out" },
];
const GOALS = [
  { value: "income", label: "Generate meaningful income" },
  { value: "equity", label: "Build long-term equity" },
  { value: "schedule", label: "Control my schedule" },
  { value: "family", label: "Build something for my family" },
  { value: "first-business", label: "First business ownership" },
  { value: "expand", label: "Expand existing operations" },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "investment" | "preferences" | "goals">("personal");

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");

  // Investment
  const [investmentRange, setInvestmentRange] = useState(150);
  const [liquidCapital, setLiquidCapital] = useState("");
  const [sbaLoan, setSbaLoan] = useState("");
  const [robsInterest, setRobsInterest] = useState("");

  // Background & Preferences
  const [background, setBackground] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [ownershipModel, setOwnershipModel] = useState("");
  const [categoryInterests, setCategoryInterests] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");

  // Goals
  const [goals, setGoals] = useState<string[]>([]);
  const [brokerHistory, setBrokerHistory] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard/profile");
        const data = await res.json();
        const b = data.buyer;
        if (!b) { setError("Profile not found."); setLoading(false); return; }

        setFullName(b.full_name ?? "");
        setEmail(b.email ?? "");
        setPhone(b.phone ?? "");
        setState(b.state ?? "");
        setInvestmentRange(b.investment_range ?? 150);
        setLiquidCapital(b.liquid_capital ?? "");
        setSbaLoan(b.sba_loan ?? "");
        setRobsInterest(b.robs_interest ?? "");
        setBackground(b.background ?? "");
        setYearsExperience(b.years_experience ?? "");
        setOwnershipModel(b.ownership_model ?? "");
        setCategoryInterests(b.category_interests ?? []);
        setTimeline(b.decision_timeline ?? "");
        setGoals(b.goals ?? []);
        setBrokerHistory(b.broker_history ?? "");
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName, phone, state, investment_range: investmentRange,
          liquid_capital: liquidCapital, sba_loan: sbaLoan, robs_interest: robsInterest,
          background, years_experience: yearsExperience, ownership_model: ownershipModel,
          category_interests: categoryInterests, decision_timeline: timeline,
          goals, broker_history: brokerHistory,
        }),
      });
      if (!res.ok) throw new Error("Save failed.");
      setSuccess("Profile updated. Your brand matches will update automatically.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(cat: string) {
    setCategoryInterests((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  function toggleGoal(goal: string) {
    setGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]);
  }

  const labelClass = "mb-1 block text-sm font-medium text-slate-700";
  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2";

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading profile...</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">My Profile & Preferences</h1>
          <p className="mt-1 text-sm text-slate-500">Update your info to improve brand matching.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-emerald-600">{success}</p>}

      <div className="mt-6 flex gap-2">
        {(["personal", "investment", "preferences", "goals"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {tab === "personal" ? "Personal Info" : tab === "investment" ? "Investment" : tab === "preferences" ? "Preferences" : "Goals"}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {activeTab === "personal" && (
          <div className="space-y-5 max-w-lg">
            <div><label className={labelClass}>Full name</label><input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><label className={labelClass}>Email</label><input className={inputClass} value={email} disabled /><p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p></div>
            <div><label className={labelClass}>Phone</label><input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div>
              <label className={labelClass}>State</label>
              <select className={inputClass} value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select</option>
                {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === "investment" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className={labelClass}>Maximum investment range</label>
              <div className="flex items-center gap-4">
                <input type="range" min={80} max={650} step={10} value={investmentRange}
                  onChange={(e) => setInvestmentRange(Number(e.target.value))}
                  className="flex-1" />
                <span className="text-sm font-semibold w-20 text-right">
                  {investmentRange >= 650 ? "$650K+" : `$${investmentRange}K`}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$80K</span><span>$650K+</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Liquid capital available</label>
              <select className={inputClass} value={liquidCapital} onChange={(e) => setLiquidCapital(e.target.value)}>
                <option value="">Select</option>
                <option value="under-50k">Under $50K</option>
                <option value="50k-100k">$50K – $100K</option>
                <option value="100k-200k">$100K – $200K</option>
                <option value="200k-500k">$200K – $500K</option>
                <option value="500k-plus">$500K+</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Interested in SBA loan?</label>
              <select className={inputClass} value={sbaLoan} onChange={(e) => setSbaLoan(e.target.value)}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe / need to learn more</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Interested in ROBS (401k rollover)?</label>
              <select className={inputClass} value={robsInterest} onChange={(e) => setRobsInterest(e.target.value)}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe / need to learn more</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className={labelClass}>Professional background</label>
              <select className={inputClass} value={background} onChange={(e) => setBackground(e.target.value)}>
                <option value="">Select</option>
                {BACKGROUNDS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Years of professional experience</label>
              <select className={inputClass} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}>
                <option value="">Select</option>
                <option value="0-5">0–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10-20">10–20 years</option>
                <option value="20-plus">20+ years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred ownership model</label>
              <div className="space-y-2 mt-2">
                {OWNERSHIP_MODELS.map((m) => (
                  <label key={m.value} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${ownershipModel === m.value ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="ownership" value={m.value} checked={ownershipModel === m.value} onChange={(e) => setOwnershipModel(e.target.value)} className="accent-amber-500" />
                    <span className="text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Category interests</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition text-sm ${categoryInterests.includes(cat) ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={categoryInterests.includes(cat)} onChange={() => toggleCategory(cat)} className="accent-amber-500" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Decision timeline</label>
              <select className={inputClass} value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                <option value="">Select</option>
                {TIMELINES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className={labelClass}>What are your goals?</label>
              <div className="space-y-2 mt-2">
                {GOALS.map((g) => (
                  <label key={g.value} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${goals.includes(g.value) ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={goals.includes(g.value)} onChange={() => toggleGoal(g.value)} className="accent-amber-500" />
                    <span className="text-sm">{g.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Have you worked with a franchise broker?</label>
              <select className={inputClass} value={brokerHistory} onChange={(e) => setBrokerHistory(e.target.value)}>
                <option value="">Select</option>
                <option value="never">Never</option>
                <option value="currently">Currently working with one</option>
                <option value="previously">Previously, not anymore</option>
                <option value="exploring">Exploring options</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
