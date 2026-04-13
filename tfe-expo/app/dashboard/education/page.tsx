"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = { id: string; session_number: number; title: string; scheduled_time: string; duration_minutes: number; is_live: boolean; recording_available: boolean };

export default function EducationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [signupMap, setSignupMap] = useState<Record<string, { status: string; attended: boolean }>>({});
  const [signingUp, setSigningUp] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=summary");
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setSignupMap(data.signupMap ?? {});
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignup(sessionId: string) {
    setSigningUp(sessionId);
    const isRegistered = !!signupMap[sessionId];
    await fetch("/api/dashboard/sessions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action: isRegistered ? "cancel" : "register" }),
    });
    setSignupMap((prev) => {
      const n = { ...prev };
      if (isRegistered) delete n[sessionId]; else n[sessionId] = { status: "registered", attended: false };
      return n;
    });
    setSigningUp(null);
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading sessions...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-lg font-semibold">Education Sessions</h1>
      <p className="mt-1 text-sm text-slate-500">TFE-hosted sessions to help you evaluate franchises with confidence.</p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
        <p className="text-sm font-medium text-amber-900">Education Guarantee</p>
        <p className="mt-1 text-sm text-amber-700">Complete all sessions and leave unprepared — free seat at the next event + a 1-on-1 matching call.</p>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Your progress</p>
          <p className="text-sm font-semibold text-amber-600">{Object.keys(signupMap).length} / {sessions.length} registered</p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${sessions.length > 0 ? (Object.keys(signupMap).length / sessions.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {sessions.map((s) => {
          const signup = signupMap[s.id];
          const isRegistered = !!signup;
          return (
            <div key={s.id} className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold ${s.is_live ? "bg-amber-500 text-white" : isRegistered ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {isRegistered && !s.is_live ? "✓" : String(s.session_number).padStart(2, "0")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {s.is_live && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                    <p className="text-sm font-semibold">{s.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {s.scheduled_time} · {s.duration_minutes} min
                    {s.recording_available ? " · Recording available" : ""}
                  </p>
                  {isRegistered && <p className="text-xs text-emerald-600 mt-0.5">✓ Registered</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.is_live && (
                  <button onClick={() => router.push(`/education/session?id=${s.id}`)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    Join live
                  </button>
                )}
                <button onClick={() => handleSignup(s.id)} disabled={signingUp === s.id}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isRegistered ? "border border-red-200 text-red-600 hover:bg-red-50" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {signingUp === s.id ? "..." : isRegistered ? "Cancel" : "Register"}
                </button>
                <button onClick={() => router.push(`/education/session?id=${s.id}`)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
