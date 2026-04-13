"use client";

import { useRouter } from "next/navigation";

const BRAND_MATCHES = [
  {
    initials: "FI",
    color: "bg-slate-900",
    name: "Fine Ink Studios",
    description: "Tattoo & piercing · $127K–$185K · FL",
    match: 97,
  },
  {
    initials: "JC",
    color: "bg-amber-800",
    name: "Jag Cantina",
    description: "Modern Mexican · $280K–$420K · FL",
    match: 88,
  },
  {
    initials: "CO",
    color: "bg-emerald-800",
    name: "Complete Outdoor Living",
    description: "Outdoor kitchen · $145K–$220K · SE US",
    match: 82,
  },
];

export default function CompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <p className="text-sm font-medium tracking-wide">
            The Franchise Edge · Virtual Expo
          </p>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-end text-xs text-slate-300">
              <span>Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-full rounded-full bg-amber-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        {/* Checkmark */}
        <div className="mb-6 text-3xl text-slate-700">✓</div>

        <h1 className="text-3xl font-semibold">You're registered.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
          Your readiness profile is being processed. Your matched brands will
          appear in your pavilion before the event opens. Here's a preview
          based on what you've shared.
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-semibold">3</p>
            <p className="mt-1 text-xs text-slate-500">Matched brands so far</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">4</p>
            <p className="mt-1 text-xs text-slate-500">
              Education sessions available
            </p>
          </div>
          <div>
            <p className="text-3xl font-semibold">82</p>
            <p className="mt-1 text-xs text-slate-500">Your readiness score</p>
          </div>
        </div>

        {/* Brand matches */}
        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Your Top Brand Matches
          </p>
          <div className="space-y-3">
            {BRAND_MATCHES.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${brand.color} text-xs font-bold text-white`}
                >
                  {brand.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{brand.name}</p>
                  <p className="text-xs text-slate-500">{brand.description}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-600">
                  {brand.match}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Go to my dashboard ↗
          </button>
          <p className="mt-4 text-xs text-slate-400">
            Confirmation sent to your email · Check your inbox for event details
          </p>
        </div>
      </main>
    </div>
  );
}