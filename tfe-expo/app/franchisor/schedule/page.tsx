"use client";

export default function FranchisorSchedulePage() {
  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Schedule</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your pitch sessions and speed connects will appear here.
      </p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
        No scheduled sessions
      </div>
    </div>
  );
}