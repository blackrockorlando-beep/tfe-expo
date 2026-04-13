"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      // 1. Create Supabase auth user
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/register/step2`,
          data: { full_name: fullName },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Account creation failed.");

      // 2. Create buyer record via API
      const response = await fetch("/api/register/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          state,
          authUserId: authData.user.id,
        }),
      });

      const result = (await response.json()) as {
        buyerId?: string;
        error?: string;
      };

      if (!response.ok || !result.buyerId) {
        throw new Error(result.error || "Buyer record could not be saved.");
      }

      localStorage.setItem("buyerId", result.buyerId);

      // 3. Check if email confirmation is required
      if (authData.user.identities?.length === 0) {
        throw new Error("An account with this email already exists. Try signing in instead.");
      }

      if (!authData.session) {
        // Email confirmation required
        setPendingVerification(true);
      } else {
        // Auto-confirmed (shouldn't happen with confirm enabled)
        router.push("/register/step2");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your registration.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-slate-900 text-white">
          <div className="mx-auto max-w-3xl px-6 py-5">
            <p className="text-sm font-medium tracking-wide">
              The Franchise Edge · Virtual Expo
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Check your email</h1>
            <p className="mt-3 text-sm text-slate-600">
              We sent a verification link to <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Click the link in the email to verify your account and continue registration.
            </p>
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                Don&apos;t see it? Check your spam folder. The email may take a minute to arrive.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <p className="text-sm font-medium tracking-wide">
            The Franchise Edge · Virtual Expo
          </p>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Step 1 of 5</span>
              <span>20%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-1/5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold">Buyer Registration</h1>
          <p className="mt-2 text-sm text-slate-600">
            Start your free registration for Franchise Virtual Expo.
          </p>

          <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">
              Your data stays private. TFE does not share your information with
              exhibiting brands until you explicitly engage with them.
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium">Full name</label>
              <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2" placeholder="Jane Smith" />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2" placeholder="jane@email.com" />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2" placeholder="At least 8 characters" />
              <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone <span className="text-slate-500">(optional)</span></label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2" placeholder="(555) 123-4567" />
            </div>

            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium">State</label>
              <select id="state" required value={state} onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-300 focus:ring-2">
                <option value="" disabled>Select your state</option>
                <option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option>
                <option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option>
                <option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option>
                <option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option>
                <option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option>
                <option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option>
                <option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option>
                <option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option>
                <option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option>
                <option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option>
                <option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option>
                <option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option>
                <option>Wisconsin</option><option>Wyoming</option>
              </select>
            </div>

            <div className="pt-3">
              {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}
              <p className="mb-4 text-sm text-slate-500">
                Free registration · no credit card · no broker callback
              </p>
              <button type="submit" disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                {isSaving ? "Creating account..." : "Continue"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already registered?{" "}
            <a href="/login" className="text-slate-700 underline hover:text-slate-900">Sign in</a>
          </p>
        </div>
      </main>
    </div>
  );
}