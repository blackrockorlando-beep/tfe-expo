"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const INVESTMENT_STEPS = [80, 150, 200, 250, 300, 350, 400, 500, 650];

function formatK(value: number) {
  return value >= 650 ? "$650K+" : `$${value}K`;
}

export default function Step2Page() {
  const router = useRouter();

  const [investmentRange, setInvestmentRange] = useState(150);
  const [liquidCapital, setLiquidCapital] = useState("");
  const [sbaLoan, setSbaLoan] = useState("");
  const [robsInterest, setRobsInterest] = useState("");
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
      const response = await fetch("/api/register/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId,
          investmentRange,
          liquidCapital,
          sbaLoan,
          robsInterest,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to save investment details.");
      }

      router.push("/register/step3");
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
              <span>Step 2 of 5</span>
              <span>40%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-2/5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your Investment Range
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            How much are you looking to invest?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This helps us match you to brands within your range. You can adjust
            this later. No minimum required to register.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Investment slider */}
            <div>
              <p className="mb-3 text-sm font-medium">
                {formatK(investmentRange)} total investment range
              </p>
              <input
                type="range"
                min={0}
                max={INVESTMENT_STEPS.length - 1}
                step={1}
                value={INVESTMENT_STEPS.indexOf(investmentRange)}
                onChange={(e) =>
                  setInvestmentRange(
                    INVESTMENT_STEPS[parseInt(e.target.value)] ?? 150,
                  )
                }
                className="w-full accent-slate-900"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>$80K</span>
                <span>$200K</span>
                <span>$350K</span>
                <span>$500K</span>
                <span>$650K+</span>
              </div>
            </div>

            {/* Liquid capital */}
            <div>
              <label
                htmlFor="liquidCapital"
                className="mb-1 block text-sm font-medium"
              >
                Liquid capital available right now
              </label>
              <select
                id="liquidCapital"
                required
                value={liquidCapital}
                onChange={(e) => setLiquidCapital(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
              >
                <option value="" disabled>
                  Select a range
                </option>
                <option>Under $50K</option>
                <option>$50K–$100K</option>
                <option>$100K–$150K</option>
                <option>$150K–$300K</option>
                <option>$300K–$500K</option>
                <option>$500K+</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Liquid means cash, accessible investment accounts, or
                self-directed 401K. Not home equity or retirement funds you
                can't access without penalty.
              </p>
            </div>

            {/* SBA + ROBS side by side */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="sbaLoan"
                  className="mb-1 block text-sm font-medium"
                >
                  SBA loan financing
                </label>
                <select
                  id="sbaLoan"
                  required
                  value={sbaLoan}
                  onChange={(e) => setSbaLoan(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option>Yes — open to SBA 7(a) loan</option>
                  <option>Maybe — want to learn more</option>
                  <option>No — prefer not to use debt</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  SBA 7(a) loans can fund up to 90% of a franchise investment.
                  Rates currently 10–12%. Pre-qualification is free.
                </p>
              </div>

              <div>
                <label
                  htmlFor="robsInterest"
                  className="mb-1 block text-sm font-medium"
                >
                  IRA / 401K rollover (ROBS)
                </label>
                <select
                  id="robsInterest"
                  required
                  value={robsInterest}
                  onChange={(e) => setRobsInterest(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option>Yes — I have retirement funds to deploy</option>
                  <option>Maybe — want to learn more</option>
                  <option>Not sure what this is</option>
                  <option>No — not applicable</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  A Rollover for Business Startups (ROBS) lets you invest
                  retirement funds into a franchise tax- and penalty-free. Often
                  used alongside SBA financing.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                You can update your profile anytime before the event
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
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