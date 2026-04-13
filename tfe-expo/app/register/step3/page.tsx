"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const BACKGROUNDS = [
  { value: "corporate", label: "Corporate / executive", description: "Director, VP, manager, operations" },
  { value: "entrepreneur", label: "Entrepreneur / business owner", description: "Currently own or have owned a business" },
  { value: "military", label: "Military veteran", description: "Active, reserve, or retired service" },
  { value: "sales", label: "Sales / business development", description: "Sales management, BD, account exec" },
  { value: "finance", label: "Finance / accounting", description: "CFO, analyst, CPA, financial advisor" },
  { value: "other", label: "Other background", description: "Healthcare, education, technical, other" },
];

export default function Step3Page() {
  const router = useRouter();

  const [background, setBackground] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    try {
      const response = await fetch("/api/register/step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, background, yearsExperience }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to save background details.");
      }

      router.push("/register/step4");
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
              <span>Step 3 of 5</span>
              <span>60%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-3/5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your Background
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Tell us a bit about yourself.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This helps our matching algorithm surface the right brands. No
            experience required — many of our best matches are first-time
            franchise buyers.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Background selector */}
            <div>
              <p className="mb-3 text-sm font-medium">
                Your professional background
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.value}
                    type="button"
                    onClick={() => setBackground(bg.value)}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      background === bg.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-medium">{bg.label}</p>
                    <p
                      className={`mt-0.5 text-xs ${
                        background === bg.value
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {bg.description}
                    </p>
                  </button>
                ))}
              </div>
              {!background && (
                <p className="mt-2 text-xs text-slate-400">
                  Select one that best describes you
                </p>
              )}
            </div>

            {/* Years of experience */}
            <div>
              <label
                htmlFor="yearsExperience"
                className="mb-1 block text-sm font-medium"
              >
                Years of management / ownership experience
              </label>
              <select
                id="yearsExperience"
                required
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
              >
                <option value="" disabled>
                  Select a range
                </option>
                <option>No experience yet</option>
                <option>1–2 years</option>
                <option>3–5 years</option>
                <option>5–10 years</option>
                <option>10+ years</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                You can update your profile anytime before the event
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/register/step2")}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !background}
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