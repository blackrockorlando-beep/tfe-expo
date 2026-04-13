"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(
    unauthorized ? "Access denied. Only authorized admins may sign in." : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/admin");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-16">
      <main className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-lg">
        <p className="text-sm font-semibold text-amber-400">The Franchise Edge</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Admin Sign In</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with your admin credentials.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none ring-amber-500 focus:ring-2"
              placeholder="scott@thefranchiseedge.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white outline-none ring-amber-500 focus:ring-2"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <a href="/auth/reset-password" className="mt-4 block text-center text-sm text-amber-600 hover:underline">Forgot your password?</a>

        {message && (
          <p className={`mt-4 text-sm ${unauthorized ? "text-red-400" : "text-slate-400"}`}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}