import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user && next.startsWith("/dashboard")) {
      const email = data.user.email?.toLowerCase();
      if (email) {
        await supabase
          .from("buyers")
          .update({ auth_user_id: data.user.id })
          .eq("email", email)
          .is("auth_user_id", null);
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}