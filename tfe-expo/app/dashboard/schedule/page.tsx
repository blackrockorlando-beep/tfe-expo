"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = { id: string; session_number: number; title: string; scheduled_time: string; duration_minutes: number; is_live: boolean };
type ScheduleEvent = { id: string; title: string; event_type: string; scheduled_at: string; duration_minutes: number; status: string; brand_id: string | null; calendly_url: string | null };

const EVENT_TYPE_LABELS: Record<string, string> = {
  education_session: "Education",
  speed_connect: "Speed Connect",
  brand_pitch: "Brand Pitch",
  calendly_call: "Scheduled Call",
  custom: "Custom Event",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  education_session: "bg-blue-100 text-blue-700 border-blue-200",
  speed_connect: "bg-amber-100 text-amber-700 border-amber-200",
  brand_pitch: "bg-purple-100 text-purple-700 border-purple-200",
  calendly_call: "bg-emerald-100 text-emerald-700 border-emerald-200",
  custom: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function SchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [signupMap, setSignupMap] = useState<Record<string, { status: string; attended: boolean }>>({});
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newType, setNewType] = useState("custom");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=summary");
      const data = await res.json();
      setSessions(data.sessions ?? []);
      setSignupMap(data.signupMap ?? {});
      setEvents((data.events ?? []).filter((e: ScheduleEvent) => e.status !== "cancelled"));
      setLoading(false);
    }
    load();
  }, []);

  async function handleAddEvent() {
    if (!newTitle || !newDate || !newTime) return;
    const scheduledAt = new Date(`${newDate}T${newTime}`).toISOString();
    const res = await fetch("/api/dashboard/schedule", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", title: newTitle, eventType: newType, scheduledAt, durationMinutes: newDuration }),
    });
    const data = await res.json();
    if (res.ok) {
      setEvents((prev) => [...prev, { id: data.id, title: newTitle, event_type: newType, scheduled_at: scheduledAt, duration_minutes: newDuration, status: "scheduled", brand_id: null, calendly_url: null }].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()));
      setShowAddEvent(false);
      setNewTitle(""); setNewDate(""); setNewTime(""); setNewDuration(30); setNewType("custom");
    }
  }

  async function handleCancelEvent(eventId: string) {
    await fetch("/api/dashboard/schedule", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel", eventId }),
    });
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }

  const registeredSessions = sessions.filter((s) => signupMap[s.id]);

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading schedule...</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">My Schedule</h1>
          <p className="mt-1 text-sm text-slate-500">{registeredSessions.length + events.length} upcoming events</p>
        </div>
        <button onClick={() => setShowAddEvent(!showAddEvent)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          + Add event
        </button>
      </div>

      {/* Add Event Form */}
      {showAddEvent && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold mb-3">Add custom event</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Follow-up call with..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none">
                <option value="custom">Custom Event</option>
                <option value="speed_connect">Speed Connect</option>
                <option value="brand_pitch">Brand Pitch</option>
                <option value="calendly_call">Scheduled Call</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Time</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-slate-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Duration (min)</label>
              <input type="number" value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-slate-300" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleAddEvent} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Add to schedule</button>
            <button onClick={() => setShowAddEvent(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Registered Sessions */}
      {registeredSessions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Education Sessions</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {registeredSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${EVENT_TYPE_COLORS.education_session}`}>Education</span>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.scheduled_time} · {s.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.is_live && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Live</span>}
                  <button onClick={() => router.push(`/education/session?id=${s.id}`)} className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50">
                    {s.is_live ? "Join" : "View"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Events */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Scheduled Events</h2>
        {events.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No events scheduled. Add one above or schedule a call with a brand.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${EVENT_TYPE_COLORS[e.event_type] ?? EVENT_TYPE_COLORS.custom}`}>
                    {EVENT_TYPE_LABELS[e.event_type] ?? "Event"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-slate-500">{new Date(e.scheduled_at).toLocaleString()} · {e.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {e.calendly_url && (
                    <a href={e.calendly_url} target="_blank" rel="noopener noreferrer" className="rounded border border-slate-200 px-3 py-1 text-xs text-amber-600 hover:bg-amber-50">Open Calendly</a>
                  )}
                  <button onClick={() => handleCancelEvent(e.id)} className="rounded border border-slate-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
