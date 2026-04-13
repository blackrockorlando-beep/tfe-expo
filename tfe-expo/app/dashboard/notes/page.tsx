"use client";

import { useEffect, useState } from "react";

type Note = { id: string; note_text: string; created_at: string; updated_at: string; brands: { name: string } | null; education_sessions: { title: string } | null };

export default function NotesPage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard?type=notes");
      const data = await res.json();
      setNotes(data.notes ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAddNote() {
    if (!newNote.trim()) return;
    const res = await fetch("/api/dashboard/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteText: newNote.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes((prev) => [{ id: data.id, note_text: newNote.trim(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), brands: null, education_sessions: null }, ...prev]);
      setNewNote("");
    }
  }

  async function handleDelete(noteId: string) {
    await fetch("/api/dashboard/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading notes...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-lg font-semibold">Notes & History</h1>
      <p className="mt-1 text-sm text-slate-500">Your private notes from sessions and brand research.</p>

      <div className="mt-6 flex gap-3">
        <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..."
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none resize-none h-20 focus:ring-2 ring-slate-300" />
        <button onClick={handleAddNote} className="self-end rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
          Save note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          No notes yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  {n.brands && <p className="text-xs font-medium text-amber-600 mb-1">{n.brands.name}</p>}
                  {n.education_sessions && <p className="text-xs font-medium text-blue-600 mb-1">{n.education_sessions.title}</p>}
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.note_text}</p>
                  <p className="mt-2 text-xs text-slate-400">{new Date(n.updated_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(n.id)} className="text-xs text-slate-400 hover:text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
