"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-sm font-semibold text-amber-500">The Franchise Edge</p>
          <h1 className="mt-2 text-xl font-semibold">Password updated</h1>
          <p className="mt-2 text-sm text-slate-500">Your password has been changed successfully.</p>
          <button onClick={() => router.push("/login")}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            Sign in
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-amber-500">The Franchise Edge</p>
        <h1 className="mt-1 text-2xl font-semibold">Set new password</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500 focus:ring-2"
              placeholder="At least 8 characters" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500 focus:ring-2"
              placeholder="Re-enter password" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </main>
    </div>
  );
}