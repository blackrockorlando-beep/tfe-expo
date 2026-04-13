"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-amber-500">The Franchise Edge</p>
        <h1 className="mt-1 text-2xl font-semibold">Reset your password</h1>

        {sent ? (
          <div className="mt-6">
            <p className="text-sm text-emerald-600">Check your email for a password reset link.</p>
            <p className="mt-2 text-xs text-slate-500">If you don't see it, check your spam folder.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-amber-500 focus:ring-2"
                placeholder="you@example.com" />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <a href="/login" className="mt-6 block text-center text-sm text-amber-600 hover:underline">← Back to login</a>
      </main>
    </div>
  );
}