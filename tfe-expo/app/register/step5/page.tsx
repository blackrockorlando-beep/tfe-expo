"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { value: "income", label: "Generate meaningful income", description: "Replace or supplement my salary" },
  { value: "equity", label: "Build long-term equity", description: "An asset I can grow or sell" },
  { value: "schedule", label: "Control my schedule", description: "Flexibility and autonomy" },
  { value: "family", label: "Build something for my family", description: "Generational or legacy business" },
  { value: "first-business", label: "First business ownership", description: "Never owned a business before" },
  { value: "expand", label: "Expand existing operations", description: "Add a proven system alongside current work" },
];

export default function Step5Page() {
  const router = useRouter();

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [brokerHistory, setBrokerHistory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
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

    if (selectedGoals.length === 0 || !brokerHistory) {
      setErrorMessage("Please select at least one goal and answer the broker question.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/register/step5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, goals: selectedGoals, brokerHistory }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to complete registration.");
      }

      router.push("/register/complete");
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
              <span>Step 5 of 5</span>
              <span>100%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-full rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your Readiness Assessment
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            One last set of questions.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            These unlock your AI matchmaking profile. The more you share, the
            better your brand matches. Takes about 2 minutes.
          </p>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {/* Goals */}
            <div>
              <p className="mb-3 text-sm font-medium">
                What are you hoping to achieve?{" "}
                <span className="font-normal text-slate-500">
                  (select all that apply)
                </span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => toggleGoal(goal.value)}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      selectedGoals.includes(goal.value)
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-medium">{goal.label}</p>
                    <p
                      className={`mt-0.5 text-xs ${
                        selectedGoals.includes(goal.value)
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {goal.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Broker history */}
            <div>
              <label
                htmlFor="brokerHistory"
                className="mb-1 block text-sm font-medium"
              >
                Have you spoken with a franchise broker before?
              </label>
              <select
                id="brokerHistory"
                required
                value={brokerHistory}
                onChange={(e) => setBrokerHistory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>No — this is my first step</option>
                <option>Yes — but I didn't find the right fit</option>
                <option>Yes — and I'm still working with one</option>
                <option>I prefer not to work with brokers</option>
              </select>
            </div>

            {/* Unlock notice */}
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="mt-0.5 text-sm text-slate-400">✓</span>
              <p className="text-sm text-slate-600">
                Completing this assessment unlocks your AI brand matching —
                your pavilion will show only the brands that fit your profile.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                You can update your profile anytime before the event
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/register/step4")}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSaving || selectedGoals.length === 0 || !brokerHistory}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Complete Registration →"}
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