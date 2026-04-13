"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Buyer = { id: string; full_name: string; email: string; phone: string | null; state: string; ownership_model: string | null; investment_range: number | null };
type Registrant = { status: string; attended: boolean; created_at: string; buyers: Buyer };
type Question = { id: string; question_text: string; votes: number; is_answered: boolean; answer_text: string | null; answered_by: string | null };

export default function PresenterSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ title: string; scheduled_time: string; duration_minutes: number; is_live: boolean } | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({ total: 0, attended: 0, questions: 0, unanswered: 0 });
  const [activeTab, setActiveTab] = useState<"registrants" | "questions">("registrants");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/presenter/sessions/${sessionId}`);
      const data = await res.json();
      setSession(data.session);
      setRegistrants(data.registrants ?? []);
      setQuestions(data.questions ?? []);
      setStats(data.stats ?? { total: 0, attended: 0, questions: 0, unanswered: 0 });
      setLoading(false);
    }
    load();
  }, [sessionId]);

  async function toggleAttendance(buyerId: string, currentAttended: boolean) {
    await fetch(`/api/presenter/sessions/${sessionId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_attendance", buyerId, attended: !currentAttended }),
    });
    setRegistrants((prev) => prev.map((r) => r.buyers.id === buyerId ? { ...r, attended: !currentAttended } : r));
    setStats((prev) => ({ ...prev, attended: prev.attended + (currentAttended ? -1 : 1) }));
  }

  async function submitAnswer(questionId: string) {
    if (!answerText.trim()) return;
    await fetch(`/api/presenter/sessions/${sessionId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer_question", questionId, answerText: answerText.trim(), answeredBy: "Presenter" }),
    });
    setQuestions((prev) => prev.map((q) => q.id === questionId ? { ...q, is_answered: true, answer_text: answerText.trim(), answered_by: "Presenter" } : q));
    setStats((prev) => ({ ...prev, unanswered: prev.unanswered - 1 }));
    setAnsweringId(null);
    setAnswerText("");
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading session...</div>;
  if (!session) return <div className="p-8 text-sm text-red-500">Session not found.</div>;

  return (
    <div className="px-8 py-8">
      <button onClick={() => router.push("/presenter")} className="text-xs text-slate-400 hover:text-slate-600">← Back to sessions</button>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{session.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{session.scheduled_time} · {session.duration_minutes} min {session.is_live ? " · 🟢 Live now" : ""}</p>
        </div>
        <a href={`/education/session?id=${sessionId}`} target="_blank" rel="noopener noreferrer"
          className="rounded-lg border border-purple-300 bg-purple-50 px-5 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition">
          Open presentation ↗
        </a>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-500">Registered</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.attended}</p>
          <p className="text-xs text-slate-500">Attended</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.questions}</p>
          <p className="text-xs text-slate-500">Questions</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{stats.unanswered}</p>
          <p className="text-xs text-slate-500">Unanswered</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        <button onClick={() => setActiveTab("registrants")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === "registrants" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          Registrants ({stats.total})
        </button>
        <button onClick={() => setActiveTab("questions")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === "questions" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          Q&A ({stats.questions}{stats.unanswered > 0 ? ` · ${stats.unanswered} unanswered` : ""})
        </button>
      </div>

      <div className="mt-6">
        {/* Registrants */}
        {activeTab === "registrants" && (
          registrants.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No registrants yet.</div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Phone</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">State</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">Registered</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500">Attended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrants.map((r) => (
                    <tr key={r.buyers.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium">{r.buyers.full_name}</td>
                      <td className="px-5 py-3 text-slate-600">{r.buyers.email}</td>
                      <td className="px-5 py-3 text-slate-600">{r.buyers.phone ?? "—"}</td>
                      <td className="px-5 py-3 text-slate-600">{r.buyers.state}</td>
                      <td className="px-5 py-3 text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-center">
                        <button onClick={() => toggleAttendance(r.buyers.id, r.attended)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${r.attended ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-slate-100 text-slate-500 border border-slate-200 hover:border-emerald-300"}`}>
                          {r.attended ? "✓ Attended" : "Mark"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Q&A */}
        {activeTab === "questions" && (
          questions.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No questions yet.</div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className={`rounded-xl border bg-white p-5 ${q.is_answered ? "border-emerald-200" : "border-amber-200"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{q.votes} votes</span>
                        <p className="text-sm font-medium">{q.question_text}</p>
                      </div>
                      {q.is_answered && q.answer_text && (
                        <div className="mt-3 ml-16 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">✓ Answered</p>
                          <p className="text-sm text-slate-700">{q.answer_text}</p>
                        </div>
                      )}
                    </div>
                    {!q.is_answered && (
                      <button onClick={() => { setAnsweringId(answeringId === q.id ? null : q.id); setAnswerText(""); }}
                        className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                        {answeringId === q.id ? "Cancel" : "Answer"}
                      </button>
                    )}
                  </div>
                  {answeringId === q.id && (
                    <div className="mt-3 ml-16">
                      <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none resize-none h-20 focus:ring-2 ring-slate-300" />
                      <button onClick={() => submitAnswer(q.id)}
                        className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                        Submit answer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
