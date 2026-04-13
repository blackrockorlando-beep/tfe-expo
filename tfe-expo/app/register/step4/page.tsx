"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const OWNERSHIP_MODELS = [
  { value: "semi-absentee", label: "Semi-absentee", description: "Keep my job / managed model" },
  { value: "owner-operator", label: "Owner-operator", description: "Fully involved day-to-day" },
  { value: "multi-unit", label: "Multi-unit", description: "Looking to scale from day one" },
  { value: "open", label: "Open to either", description: "Want to explore options" },
];

const CATEGORIES = [
  "Health & beauty",
  "Food & beverage",
  "Home services",
  "Fitness & wellness",
  "Retail",
  "B2B services",
  "Pet services",
  "Education & tutoring",
];

const TIMELINES = [
  { value: "within-3-months", label: "Within 3 months", description: "Actively deciding now" },
  { value: "3-6-months", label: "3–6 months", description: "Researching seriously" },
  { value: "6-12-months", label: "6–12 months", description: "Taking my time" },
  { value: "12-plus-months", label: "12+ months out", description: "Early exploration" },
];

export default function Step4Page() {
  const router = useRouter();

  const [ownershipModel, setOwnershipModel] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const buyerId =
      typeof window !== "undefined" ? localStorage.getItem("buyerId") : null;

    if (!buyerId) {
      setErrorMessage("Session expired. Please start registration again.");
      setIsSaving(false);
      router.push("/register");
      return;
    }

    if (!ownershipModel || !timeline) {
      setErrorMessage("Please select an ownership model and decision timeline.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/register/step4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId,
          ownershipModel,
          categoryInterests: selectedCategories,
          timeline,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to save preferences.");
      }

      router.push("/register/step5");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <p className="text-sm font-medium tracking-wide">
            The Franchise Edge · Virtual Expo
          </p>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Step 4 of 5</span>
              <span>80%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-4/5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            What You're Looking For
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            What kind of opportunity fits your life?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Select everything that applies. Your answers shape which brands
            appear in your pavilion.
          </p>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {/* Ownership model */}
            <div>
              <p className="mb-3 text-sm font-medium">
                Ownership model preference
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {OWNERSHIP_MODELS.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => setOwnershipModel(model.value)}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      ownershipModel === model.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-medium">{model.label}</p>
                    <p className={`mt-0.5 text-xs ${ownershipModel === model.value ? "text-slate-300" : "text-slate-500"}`}>
                      {model.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="mb-3 text-sm font-medium">
                Categories of interest{" "}
                <span className="font-normal text-slate-500">
                  (select all that apply)
                </span>
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                      selectedCategories.includes(cat)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="mb-3 text-sm font-medium">Decision timeline</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeline(t.value)}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      timeline === t.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className={`mt-0.5 text-xs ${timeline === t.value ? "text-slate-300" : "text-slate-500"}`}>
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                You can update your profile anytime before the event
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/register/step3")}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !ownershipModel || !timeline}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Continue →"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}