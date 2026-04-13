"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SlideForm = { tag: string; title: string; body: string; presenter_note: string; outline_label: string };
type Presenter = { id: string; full_name: string; initials: string };
type ResourceForm = { title: string; description: string; file_type: string; file_url?: string };

const EMPTY_SLIDE: SlideForm = { tag: "", title: "", body: "", presenter_note: "", outline_label: "" };
const EMPTY_RESOURCE: ResourceForm = { title: "", description: "", file_type: "PDF", file_url: "" };

export default function EducationSessionForm({ sessionId }: { sessionId?: string }) {
  const router = useRouter();
  const isEdit = !!sessionId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [activeSection, setActiveSection] = useState<"details" | "slides" | "resources">("details");
  const [activeSlide, setActiveSlide] = useState(0);

  const [showPresenterModal, setShowPresenterModal] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [newPresenter, setNewPresenter] = useState({ full_name: "", initials: "", title: "", organization: "", avatar_color: "#BE123C" });

  const [sessionNumber, setSessionNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [scheduledTime, setScheduledTime] = useState("");
  const [track, setTrack] = useState("Education");
  const [tags, setTags] = useState("");
  const [presenterId, setPresenterId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  const [slides, setSlides] = useState<SlideForm[]>([{ ...EMPTY_SLIDE }]);
  const [resources, setResources] = useState<ResourceForm[]>([]);

  useEffect(() => {
    fetch("/api/admin/presenters").then((r) => r.json()).then((d) => setPresenters(d.presenters ?? []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const res = await fetch(`/api/admin/education/${sessionId}`);
        const data = await res.json();
        const s = data.session;
        if (!s) { setError("Session not found."); setLoading(false); return; }

        setSessionNumber(s.session_number);
        setTitle(s.title ?? "");
        setSubtitle(s.subtitle ?? "");
        setDescription(s.description ?? "");
        setDurationMinutes(s.duration_minutes ?? 45);
        setScheduledTime(s.scheduled_time ?? "");
        setTrack(s.track ?? "Education");
        setTags((s.tags ?? []).join(", "));
        setPresenterId(s.presenter_id ?? "");
        setIsLive(s.is_live ?? false);
        setRecordingAvailable(s.recording_available ?? false);
        setDisplayOrder(s.display_order ?? 1);

        if (data.slides?.length) {
          setSlides(data.slides.map((sl: SlideForm & { slide_number: number }) => ({
            tag: sl.tag ?? "", title: sl.title ?? "", body: sl.body ?? "",
            presenter_note: sl.presenter_note ?? "", outline_label: sl.outline_label ?? "",
          })));
        }

        if (data.resources?.length) {
          setResources(data.resources.map((r: ResourceForm & { file_url?: string }) => ({
            title: r.title ?? "", description: r.description ?? "",
            file_type: r.file_type ?? "PDF", file_url: r.file_url ?? "",
          })));
        }
      } catch {
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isEdit, sessionId]);

  function updateSlide(index: number, field: keyof SlideForm, value: string) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSlide() {
    setSlides((prev) => [...prev, { ...EMPTY_SLIDE }]);
    setActiveSlide(slides.length);
  }

  function removeSlide(index: number) {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index));
    setActiveSlide(Math.max(0, activeSlide - 1));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setSlides(updated);
    setActiveSlide(target);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload = {
      session_number: sessionNumber, title, subtitle, description,
      duration_minutes: durationMinutes, scheduled_time: scheduledTime, track,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      presenter_id: presenterId || null, is_live: isLive,
      recording_available: recordingAvailable, display_order: displayOrder,
      slides,
      resources: resources.map((r) => ({ ...r, file_url: r.file_url || null })),
    };
    try {
      const url = isEdit ? `/api/admin/education/${sessionId}` : "/api/admin/education";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(isEdit ? "Session updated." : "Session created.");
      if (!isEdit && data.id) {
        setTimeout(() => router.push(`/admin/education/${data.id}`), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreatePresenter() {
    const res = await fetch("/api/admin/presenters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPresenter),
    });
    const data = await res.json();
    if (res.ok) {
      setPresenters((prev) => [...prev, { id: data.id, full_name: newPresenter.full_name, initials: newPresenter.initials }]);
      setPresenterId(data.id);
      setShowPresenterModal(false);
      setNewPresenter({ full_name: "", initials: "", title: "", organization: "", avatar_color: "#BE123C" });
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", sessionId ?? "new");
      const res = await fetch("/api/admin/education/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = [...resources];
      updated[index] = { ...updated[index], file_url: data.url, file_type: data.fileType, title: updated[index].title || file.name.replace(/\.[^/.]+$/, "") };
      setResources(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  }

  const labelClass = "mb-1 block text-sm font-medium text-slate-700";
  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2";

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading...</div>;

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.push("/admin/education")} className="text-xs text-slate-400 hover:text-slate-600">← Back to sessions</button>
          <h1 className="mt-1 text-xl font-semibold">{isEdit ? `Edit: ${title}` : "New Education Session"}</h1>
        </div>
        <div className="flex items-center gap-3">
        {isEdit && (
            <>
              <button onClick={() => router.push(`/admin/education/${sessionId}/registrants`)}
                className="rounded-lg border border-emerald-400 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition">
                Registrants
              </button>
              <a href={`/education/session?id=${sessionId}`} target="_blank" rel="noopener noreferrer"
                className="rounded-lg border border-amber-400 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition">
                Preview session ↗
              </a>
            </>
          )}
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">
            {saving ? "Saving..." : "Save session"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-emerald-600">{success}</p>}

      <div className="mt-6 flex gap-2">
        {(["details", "slides", "resources"] as const).map((sec) => (
          <button key={sec} onClick={() => setActiveSection(sec)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeSection === sec ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {sec === "details" ? "Session Details" : sec === "slides" ? `Slides (${slides.length})` : `Resources (${resources.length})`}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {activeSection === "details" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-5">
              <div><label className={labelClass}>Session number</label><input type="number" className={inputClass} value={sessionNumber} onChange={(e) => setSessionNumber(Number(e.target.value))} /></div>
              <div><label className={labelClass}>Display order</label><input type="number" className={inputClass} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} /></div>
              <div><label className={labelClass}>Duration (minutes)</label><input type="number" className={inputClass} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>Title</label><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Understanding the FDD" /></div>
              <div><label className={labelClass}>Subtitle</label><input className={inputClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="How to read a Franchise Disclosure Document" /></div>
            </div>
            <div><label className={labelClass}>Description</label><input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="45 min · live Q&A included · recording available" /></div>
            <div className="grid grid-cols-3 gap-5">
              <div><label className={labelClass}>Scheduled time</label><input className={inputClass} value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} placeholder="9:00 AM" /></div>
              <div><label className={labelClass}>Track</label><input className={inputClass} value={track} onChange={(e) => setTrack(e.target.value)} /></div>
              <div><label className={labelClass}>Tags (comma-separated)</label><input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="FDD basics, Item 19" /></div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Presenter</label>
                <div className="flex gap-2">
                  <select className={`${inputClass} flex-1`} value={presenterId} onChange={(e) => setPresenterId(e.target.value)}>
                    <option value="">Select presenter</option>
                    {presenters.map((p) => <option key={p.id} value={p.id}>{p.full_name} ({p.initials})</option>)}
                  </select>
                  <button onClick={() => setShowPresenterModal(true)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">+ New</button>
                </div>
              </div>
              <div className="flex items-end gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} className="rounded" /> Live now</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={recordingAvailable} onChange={(e) => setRecordingAvailable(e.target.checked)} className="rounded" /> Recording available</label>
              </div>
            </div>
          </div>
        )}

        {activeSection === "slides" && (
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {slides.map((s, i) => (
                <button key={i} onClick={() => setActiveSlide(i)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${i === activeSlide ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {i + 1}. {s.outline_label || s.tag || `Slide ${i + 1}`}
                </button>
              ))}
              <button onClick={addSlide} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">+ Add slide</button>
            </div>
            {slides[activeSlide] && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Slide {activeSlide + 1} of {slides.length}</p>
                  <div className="flex gap-2">
                    <button onClick={() => moveSlide(activeSlide, -1)} disabled={activeSlide === 0} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30">↑ Move up</button>
                    <button onClick={() => moveSlide(activeSlide, 1)} disabled={activeSlide === slides.length - 1} className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30">↓ Move down</button>
                    <button onClick={() => removeSlide(activeSlide)} disabled={slides.length <= 1} className="rounded border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-30">Remove</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Outline label</label><input className={inputClass} value={slides[activeSlide].outline_label} onChange={(e) => updateSlide(activeSlide, "outline_label", e.target.value)} placeholder="What is the FDD?" /><p className="mt-1 text-xs text-slate-400">Shown in the session outline bar</p></div>
                  <div><label className={labelClass}>Tag / topic</label><input className={inputClass} value={slides[activeSlide].tag} onChange={(e) => updateSlide(activeSlide, "tag", e.target.value)} placeholder="Item 1–4" /><p className="mt-1 text-xs text-slate-400">Badge shown above the slide title</p></div>
                </div>
                <div><label className={labelClass}>Slide title</label><textarea className={`${inputClass} h-20 resize-none`} value={slides[activeSlide].title} onChange={(e) => updateSlide(activeSlide, "title", e.target.value)} placeholder={"The FDD is a legal document.\nNot a marketing brochure."} /><p className="mt-1 text-xs text-slate-400">Use line breaks for multi-line titles</p></div>
                <div><label className={labelClass}>Slide body</label><textarea className={`${inputClass} h-28 resize-none`} value={slides[activeSlide].body} onChange={(e) => updateSlide(activeSlide, "body", e.target.value)} placeholder="Franchisors are required by federal law..." /></div>
                <div><label className={labelClass}>Presenter note</label><textarea className={`${inputClass} h-20 resize-none`} value={slides[activeSlide].presenter_note} onChange={(e) => updateSlide(activeSlide, "presenter_note", e.target.value)} placeholder="Think of the FDD as the franchisor's legal obligation..." /><p className="mt-1 text-xs text-slate-400">Shown in the presenter note box (italic, amber text)</p></div>
              </div>
            )}
          </div>
        )}

        {activeSection === "resources" && (
          <div className="space-y-4">
            {resources.map((r, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelClass}>Title</label><input className={inputClass} value={r.title} onChange={(e) => { const u = [...resources]; u[i] = { ...u[i], title: e.target.value }; setResources(u); }} placeholder="FDD Checklist PDF" /></div>
                  <div><label className={labelClass}>Description</label><input className={inputClass} value={r.description} onChange={(e) => { const u = [...resources]; u[i] = { ...u[i], description: e.target.value }; setResources(u); }} placeholder="23-item checklist for reviewing any FDD" /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><label className={labelClass}>File type</label><select className={inputClass} value={r.file_type} onChange={(e) => { const u = [...resources]; u[i] = { ...u[i], file_type: e.target.value }; setResources(u); }}><option>PDF</option><option>XLSX</option><option>DOCX</option><option>PPTX</option><option>Link</option></select></div>
                    <button onClick={() => setResources(resources.filter((_, j) => j !== i))} className="mt-6 text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
                </div>
                <div className="mt-3">
                  {r.file_url ? (
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700">✓ File uploaded</span>
                      <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline hover:text-blue-800">View file</a>
                      <button onClick={() => { const u = [...resources]; u[i] = { ...u[i], file_url: "" }; setResources(u); }} className="text-xs text-slate-400 hover:text-red-500">Remove file</button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1v10M4 5l4-4 4 4" /><path d="M1 11v3a1 1 0 001 1h12a1 1 0 001-1v-3" /></svg>
                      {uploadingIndex === i ? "Uploading..." : "Upload file"}
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, i)} disabled={uploadingIndex === i} />
                    </label>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => setResources([...resources, { ...EMPTY_RESOURCE }])} className="text-sm text-amber-600 hover:underline">+ Add resource</button>
          </div>
        )}
      </div>

      {showPresenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">New Presenter</h2>
            <div className="space-y-3">
              <div><label className={labelClass}>Full name</label><input className={inputClass} value={newPresenter.full_name} onChange={(e) => setNewPresenter({ ...newPresenter, full_name: e.target.value })} /></div>
              <div><label className={labelClass}>Initials</label><input className={inputClass} value={newPresenter.initials} onChange={(e) => setNewPresenter({ ...newPresenter, initials: e.target.value })} placeholder="PS" /></div>
              <div><label className={labelClass}>Title</label><input className={inputClass} value={newPresenter.title} onChange={(e) => setNewPresenter({ ...newPresenter, title: e.target.value })} placeholder="Co-Founder" /></div>
              <div><label className={labelClass}>Organization</label><input className={inputClass} value={newPresenter.organization} onChange={(e) => setNewPresenter({ ...newPresenter, organization: e.target.value })} placeholder="The Franchise Edge" /></div>
              <div><label className={labelClass}>Avatar color</label><input type="color" value={newPresenter.avatar_color} onChange={(e) => setNewPresenter({ ...newPresenter, avatar_color: e.target.value })} className="h-10 w-16 rounded border border-slate-300 cursor-pointer" /></div>
            </div>
            <div className="mt-5 flex gap-3 justify-end">
              <button onClick={() => setShowPresenterModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreatePresenter} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
