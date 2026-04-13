"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PresenterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/presenter");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <main className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-purple-600">The Franchise Edge</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Presenter Portal</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage your sessions and view registrants.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-purple-500 focus:ring-2"
              placeholder="presenter@thefranchiseedge.com" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-purple-500 focus:ring-2"
              placeholder="Your password" />
          </label>
          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <a href="/auth/reset-password" className="mt-4 block text-center text-sm text-amber-600 hover:underline">Forgot your password?</a>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </main>
    </div>
  );
}
