"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setMessage("Please verify your email first. Check your inbox for the confirmation link.");
      } else {
        setMessage(error.message);
      }
    } else {
      router.push("/dashboard");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Sign in to your Expo Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Enter the email and password you registered with.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <a href="/auth/reset-password" className="mt-4 block text-center text-sm text-amber-600 hover:underline">Forgot your password?</a>

        {message && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}

        <p className="mt-6 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300">
            Register here
          </a>
        </p>
      </main>
    </div>
  );
}