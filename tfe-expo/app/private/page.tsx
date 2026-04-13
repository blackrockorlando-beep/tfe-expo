import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Protected page
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          Welcome, {user.email ?? user.id}. Your Supabase session is active.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
