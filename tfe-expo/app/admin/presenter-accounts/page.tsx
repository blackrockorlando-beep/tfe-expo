"use client";

import { useEffect, useState, FormEvent } from "react";

type Presenter = { id: string; full_name: string; initials: string; title: string; organization: string; email: string | null; auth_user_id: string | null; brand_id: string | null; brands: { name: string } | null };

export default function PresenterAccountsPage() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresenter, setSelectedPresenter] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/presenter-accounts");
      const data = await res.json();
      setPresenters(data.presenters ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/presenter-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presenterId: selectedPresenter, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Account created for ${email}. They can sign in at /presenter/login`);
      setEmail("");
      setPassword("");
      setSelectedPresenter("");
      // Refresh list
      const res2 = await fetch("/api/admin/presenter-accounts");
      const data2 = await res2.json();
      setPresenters(data2.presenters ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSaving(false);
    }
  }

  const unlinked = presenters.filter((p) => !p.auth_user_id);
  const linked = presenters.filter((p) => p.auth_user_id);

  if (loading) return <div className="p-8 text-sm text-slate-400">Loading...</div>;

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Presenter Accounts</h1>
      <p className="mt-2 text-sm text-slate-500">Create login credentials for presenters so they can manage their sessions and view registrants.</p>

      {/* Existing accounts */}
      {linked.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Active presenter accounts</h2>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {linked.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{p.full_name} ({p.initials})</p>
                  <p className="text-xs text-slate-500">{p.email} · {p.title}{p.organization ? `, ${p.organization}` : ""}</p>
                  {p.brands && <p className="text-xs text-amber-600 mt-0.5">Linked brand: {p.brands.name}</p>}
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Has login</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create new account */}
      {unlinked.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Create presenter login</h2>
          <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">Presenter</label>
              <select required value={selectedPresenter} onChange={(e) => setSelectedPresenter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2">
                <option value="">Select presenter</option>
                {unlinked.map((p) => <option key={p.id} value={p.id}>{p.full_name} ({p.initials}) — {p.title}, {p.organization}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
                placeholder="presenter@thefranchiseedge.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Temporary password</label>
              <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
                placeholder="At least 8 characters" />
              <p className="mt-1 text-xs text-slate-400">Share with the presenter. They can change it later.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-emerald-600">{message}</p>}

            <button type="submit" disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">
              {saving ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
          All presenters have accounts. Create a new presenter in the Education session editor to assign them here.
        </div>
      )}
    </div>
  );
}
