"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

type Slide = { id: string; slide_number: number; tag: string; title: string; body: string; presenter_note: string; outline_label: string };
type Question = { id: string; question_text: string; votes: number; is_answered: boolean; answer_text: string | null; answered_by: string | null };
type Resource = { id: string; title: string; description: string; file_type: string; file_url: string | null };
type Presenter = { initials: string; full_name: string; title: string; organization: string; avatar_color: string };
type Session = { id: string; session_number: number; title: string; subtitle: string; description: string; duration_minutes: number; scheduled_time: string; tags: string[]; is_live: boolean; presenters: Presenter };
type SidebarSession = { id: string; session_number: number; title: string; scheduled_time: string; duration_minutes: number; is_live: boolean };

export default function EducationSessionPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id") ?? "b1b2c3d4-0001-4000-8000-000000000001";

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [allSessions, setAllSessions] = useState<SidebarSession[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"qa" | "notes" | "resources">("qa");
  const [newQuestion, setNewQuestion] = useState("");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [myNotes, setMyNotes] = useState("");
  const [slidesViewed, setSlidesViewed] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/education/sessions/${sessionId}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setSession(data.session);
        setSlides(data.slides);
        setQuestions(data.questions);
        setResources(data.resources);
        setAllSessions(data.allSessions);
        setSessionSeconds((data.session?.duration_minutes ?? 45) * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  useEffect(() => {
    if (sessionSeconds <= 0) return;
    const timer = setInterval(() => setSessionSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [sessionSeconds]);

  useEffect(() => {
    setSlidesViewed((prev) => new Set([...prev, currentSlide]));
  }, [currentSlide]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }, []);

  function handleVote(id: string) {
    if (votedIds.has(id)) return;
    setVotedIds(new Set([...votedIds, id]));
    setQuestions((prev) =>
      [...prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))].sort((a, b) => b.votes - a.votes)
    );
  }

  function handleSubmitQuestion() {
    if (!newQuestion.trim()) return;
    const q: Question = { id: `local-${Date.now()}`, question_text: newQuestion.trim(), votes: 1, is_answered: false, answer_text: null, answered_by: null };
    setQuestions((prev) => [...prev, q].sort((a, b) => b.votes - a.votes));
    setVotedIds(new Set([...votedIds, q.id]));
    setNewQuestion("");
  }

  if (loading) {
    return (
      <>
        <style>{`body { background: #080E1A !important; margin: 0; }`}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontFamily: "'DM Sans', sans-serif" }}>Loading session...</div>
      </>
    );
  }

  if (!session || slides.length === 0) {
    return (
      <>
        <style>{`body { background: #080E1A !important; margin: 0; }`}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontFamily: "'DM Sans', sans-serif" }}>Session not found.</div>
      </>
    );
  }

  const slide = slides[currentSlide];
  const presenter = session.presenters;
  const totalDuration = session.duration_minutes * 60;
  const sessionScore = Math.min(100, Math.round(
    (slidesViewed.size / slides.length) * 40 + questions.filter((q) => q.is_answered).length * 5 + (votedIds.size > 0 ? 15 : 0) + (myNotes.length > 0 ? 10 : 0) + 20
  ));

  return (
    <>
      <style>{`body { background: #080E1A !important; margin: 0; } @keyframes waveform { 0% { transform: scaleY(1); } 100% { transform: scaleY(0.3); } }`}</style>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080E1A", color: "#fff", minHeight: "100vh" }}>

        {/* TOP NAV */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1E293B", background: "#0C1322", padding: "14px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#F59E0B" }}>The Franchise Edge</span>
            <span style={{ fontSize: "14px", color: "#64748B" }}>Virtual Expo</span>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Education Track</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {session.is_live && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16,185,129,0.12)", borderRadius: "20px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, color: "#34D399" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34D399" }} />
                Live now
              </span>
            )}
            <span style={{ fontSize: "14px", color: "#64748B" }}>312 watching</span>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>

          {/* LEFT COLUMN — 65% */}
          <div style={{ width: "65%", background: "#0B1120", borderRight: "3px solid #1E293B" }}>

            {/* Presentation Area */}
            <div style={{ padding: "40px 48px 0", minHeight: "480px", display: "flex", flexDirection: "column" }}>

              {/* Session Outline */}
              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#475569", marginBottom: "10px" }}>SESSION OUTLINE</p>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  {slides.map((s: Slide, i: number) => (
                    <span key={i} onClick={() => setCurrentSlide(i)}
                      style={{ fontSize: "13px", color: i === currentSlide ? "#F59E0B" : "#64748B", fontWeight: i === currentSlide ? 600 : 400, cursor: "pointer", transition: "color 0.2s" }}>
                      {s.outline_label || s.tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Slide counter + tag */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <span style={{ fontSize: "14px", fontFamily: "monospace", color: "#475569" }}>
                  {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "20px", padding: "4px 16px", fontSize: "12px", fontWeight: 600, color: "#F59E0B" }}>
                  {slide.tag}
                </span>
              </div>

              {/* Slide title */}
              <h2 style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2, whiteSpace: "pre-line", letterSpacing: "-0.02em", margin: 0 }}>
                {slide.title}
              </h2>

              {/* Slide body */}
              <p style={{ marginTop: "24px", fontSize: "16px", lineHeight: 1.7, color: "#94A3B8", maxWidth: "720px", flex: 1 }}>
                {slide.body}
              </p>

              {/* Presenter Note */}
              {slide.presenter_note && (
                <div style={{ marginTop: "auto", background: "#131D30", border: "1px solid #1E293B", borderRadius: "12px", padding: "24px", maxWidth: "640px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#475569", marginBottom: "8px" }}>PRESENTER NOTE</p>
                  <p style={{ fontSize: "14px", fontStyle: "italic", color: "rgba(253,230,138,0.85)", lineHeight: 1.7, margin: 0 }}>
                    {slide.presenter_note}
                  </p>
                </div>
              )}

              {/* Slide Navigation */}
              <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {slides.map((_: Slide, i: number) => (
                    <button key={i} onClick={() => setCurrentSlide(i)}
                      style={{ height: "10px", width: i === currentSlide ? "32px" : "10px", borderRadius: "5px", border: "none", cursor: "pointer", transition: "all 0.3s",
                        background: i === currentSlide ? "#F59E0B" : i < currentSlide ? "#475569" : "#1E293B" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))} disabled={currentSlide === 0}
                    style={{ borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: currentSlide === 0 ? "#1E293B" : "#94A3B8", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
                    ← Prev
                  </button>
                  <button onClick={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))} disabled={currentSlide === slides.length - 1}
                    style={{ borderRadius: "8px", border: "1px solid #334155", background: "transparent", color: currentSlide === slides.length - 1 ? "#1E293B" : "#94A3B8", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Presenter Bar */}
            <div style={{ margin: "0 48px", display: "flex", alignItems: "center", gap: "20px", background: "#131D30", border: "1px solid #1E293B", borderRadius: "12px", padding: "16px 24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: presenter.avatar_color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>{presenter.initials}</div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{presenter.full_name}</p>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0" }}>{presenter.title} · {presenter.organization}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "12px" }}>
                {[40, 70, 55, 85, 45, 75, 35, 65, 80, 50, 70, 40, 60, 85, 45].map((h, i) => (
                  <div key={i} style={{ width: "3px", height: `${h * 0.28}px`, borderRadius: "2px",
                    background: i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#FB923C" : "#FBBF24",
                    animation: `waveform ${0.4 + (i % 5) * 0.15}s ease-in-out infinite alternate`, animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Session time remaining</span>
                <div style={{ width: "128px", height: "8px", borderRadius: "4px", background: "#1E293B", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "4px", background: "#3B82F6", width: `${(sessionSeconds / totalDuration) * 100}%`, transition: "width 1s" }} />
                </div>
                <span style={{ fontSize: "16px", fontFamily: "monospace", fontWeight: 700, width: "56px", textAlign: "right" }}>{formatTime(sessionSeconds)}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ margin: "24px 48px", height: "1px", background: "#1E293B" }} />

            {/* Tabs */}
            <div style={{ padding: "0 48px 48px" }}>
              <div style={{ display: "flex", gap: "32px", marginBottom: "24px", borderBottom: "1px solid #1E293B" }}>
                {(["qa", "notes", "resources"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ paddingBottom: "12px", fontSize: "14px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", borderBottom: activeTab === tab ? "2px solid #F59E0B" : "2px solid transparent", color: activeTab === tab ? "#fff" : "#64748B", display: "flex", alignItems: "center", gap: "8px" }}>
                    {tab === "qa" ? "Q&A" : tab === "notes" ? "My notes" : "Resources"}
                    {tab === "qa" && <span style={{ background: "#F59E0B", borderRadius: "12px", padding: "2px 8px", fontSize: "11px", fontWeight: 700, color: "#fff" }}>{questions.length}</span>}
                  </button>
                ))}
              </div>

              {activeTab === "qa" && (
                <div>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                    <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitQuestion()}
                      placeholder="Ask a question about the FDD..."
                      style={{ flex: 1, borderRadius: "12px", background: "#131D30", border: "1px solid #1E293B", padding: "14px 20px", fontSize: "14px", color: "#fff", outline: "none" }} />
                    <button onClick={handleSubmitQuestion}
                      style={{ borderRadius: "12px", background: "#F59E0B", padding: "14px 20px", fontSize: "14px", fontWeight: 600, color: "#0B1120", border: "none", cursor: "pointer" }}>
                      Ask
                    </button>
                  </div>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#334155", marginBottom: "16px" }}>QUESTIONS — sorted by votes</p>
                  <div>
                    {questions.map((q) => (
                      <div key={q.id} style={{ borderRadius: "12px", border: `1px solid ${q.is_answered ? "rgba(245,158,11,0.2)" : "#1E293B"}`, background: q.is_answered ? "#131D30" : "#0D1526", padding: "20px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", gap: "20px" }}>
                          <button onClick={() => handleVote(q.id)}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: votedIds.has(q.id) ? "#F59E0B" : "#475569", minWidth: "32px", paddingTop: "2px" }}>
                            <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor"><path d="M7 0L14 9H0L7 0Z" /></svg>
                            <span style={{ fontSize: "14px", fontWeight: 700 }}>{q.votes}</span>
                          </button>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{q.question_text}</p>
                            {q.is_answered && q.answer_text ? (
                              <div style={{ marginTop: "12px" }}>
                                <p style={{ fontSize: "11px", fontWeight: 700, color: "#34D399", marginBottom: "6px" }}>✓ ANSWERED BY {(q.answered_by ?? "PAUL").toUpperCase()}</p>
                                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{q.answer_text}</p>
                              </div>
                            ) : (
                              <p style={{ marginTop: "6px", fontSize: "12px", color: "#334155" }}>Awaiting answer</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div>
                  <textarea value={myNotes} onChange={(e) => setMyNotes(e.target.value)}
                    placeholder="Take notes during the session..."
                    style={{ width: "100%", height: "280px", borderRadius: "12px", background: "#131D30", border: "1px solid #1E293B", padding: "20px", fontSize: "14px", color: "#fff", outline: "none", resize: "none", boxSizing: "border-box" }} />
                  <p style={{ marginTop: "8px", fontSize: "12px", color: "#334155" }}>
                    {myNotes.length > 0 ? `${myNotes.split(/\s+/).filter(Boolean).length} words` : "Start typing to take notes"}
                  </p>
                </div>
              )}

              {activeTab === "resources" && (
                <div>
                  {resources.map((r) => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "12px", background: "#131D30", border: "1px solid #1E293B", padding: "20px", marginBottom: "12px" }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>{r.title}</p>
                        <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>{r.description}</p>
                      </div>
                      <span style={{ borderRadius: "8px", background: "#1E293B", padding: "6px 12px", fontSize: "12px", fontWeight: 500, color: "#94A3B8" }}>{r.file_type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN — 35% */}
          <div style={{ width: "35%", background: "#1A2740", flexShrink: 0 }}>
            <div style={{ padding: "32px 28px" }}>

              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#475569", marginBottom: "8px" }}>{session.title.toUpperCase()}</p>
              <h3 style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.4, margin: "0 0 8px" }}>{session.subtitle}</h3>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>{session.description}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
                <div style={{ borderRadius: "12px", border: "1px solid #1E293B", background: "#0B1120", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#64748B", margin: "0 0 4px" }}>Session</p>
                  <p style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{session.session_number} of {allSessions.length}</p>
                </div>
                <div style={{ borderRadius: "12px", border: "1px solid #1E293B", background: "#0B1120", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#64748B", margin: "0 0 4px" }}>Track</p>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#F59E0B", margin: 0 }}>Education</p>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                {(session.tags ?? []).map((tag: string) => (
                  <span key={tag} style={{ borderRadius: "20px", border: "1px solid #334155", padding: "4px 12px", fontSize: "12px", color: "#94A3B8" }}>{tag}</span>
                ))}
              </div>

              <div style={{ height: "1px", background: "#1E293B", margin: "28px 0" }} />

              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#475569", marginBottom: "16px" }}>YOUR ENGAGEMENT</p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Session score</span>
                <span style={{ fontSize: "32px", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{sessionScore}</span>
              </div>
              <div style={{ height: "10px", borderRadius: "5px", background: "#0B1120", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ height: "100%", borderRadius: "5px", background: "#F59E0B", width: `${sessionScore}%`, transition: "width 0.7s" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#64748B" }}>Slides viewed</span>
                  <span style={{ fontWeight: 600 }}>{slidesViewed.size} / {slides.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#64748B" }}>Questions upvoted</span>
                  <span style={{ fontWeight: 600 }}>{votedIds.size}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#64748B" }}>Notes taken</span>
                  <span style={{ fontWeight: 600 }}>{myNotes.length > 0 ? myNotes.split(/\s+/).filter(Boolean).length : 0}</span>
                </div>
              </div>

              <div style={{ height: "1px", background: "#1E293B", margin: "28px 0" }} />

              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#475569", marginBottom: "16px" }}>ALL SESSIONS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {allSessions.map((s) => (
                  <div key={s.id} onClick={() => { if (s.id !== sessionId) window.location.href = `/education/session?id=${s.id}`; }}
                    style={{ display: "flex", alignItems: "center", gap: "12px", borderRadius: "12px", background: "#0B1120", border: s.id === sessionId ? "1px solid #F59E0B" : "1px solid #1E293B", padding: "14px", cursor: "pointer" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0, background: s.is_live ? "#F59E0B" : "#1E293B", color: s.is_live ? "#0B1120" : "#64748B" }}>
                      {String(s.session_number).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                      <p style={{ fontSize: "11px", color: "#475569", margin: "2px 0 0" }}>{s.scheduled_time} · {s.duration_minutes} min</p>
                    </div>
                    {s.is_live && (
                      <span style={{ borderRadius: "20px", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", padding: "4px 10px", fontSize: "10px", fontWeight: 600, color: "#34D399", flexShrink: 0 }}>Live</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ height: "1px", background: "#1E293B", margin: "28px 0" }} />

              <div style={{ borderRadius: "12px", border: "1px solid rgba(245,158,11,0.2)", background: "rgba(120,53,15,0.2)", padding: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#F59E0B", marginBottom: "8px" }}>EDUCATION GUARANTEE</p>
                <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6, margin: 0 }}>
                  Complete all 4 sessions and leave unprepared — free seat at the next event + a 1-on-1 matching call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
