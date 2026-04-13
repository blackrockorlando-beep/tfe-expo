"use client";

import { useEffect, useState, FormEvent } from "react";

type Brand = { id: string; name: string };

export default function FranchisorAccountsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrands() {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data.brands ?? []);
    }
    loadBrands();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/franchisor-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, brandId: selectedBrand }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(`Account created for ${email}. They can sign in at /franchisor/login`);
      setEmail("");
      setPassword("");
      setSelectedBrand("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold">Create Franchisor Account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Set up login credentials for a franchisor and link them to their brand.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Brand</label>
          <select required value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2">
            <option value="">Select a brand</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Franchisor email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
            placeholder="franchisor@theirbrand.com" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Temporary password</label>
          <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2"
            placeholder="At least 8 characters" />
          <p className="mt-1 text-xs text-slate-400">Share this with the franchisor. They can change it later.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <button type="submit" disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70">
          {saving ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}