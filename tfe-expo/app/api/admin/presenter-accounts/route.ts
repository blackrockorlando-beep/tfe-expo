import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("presenters")
      .select("id, full_name, initials, title, organization, email, auth_user_id, brand_id, brands(name)")
      .order("full_name");
    if (error) throw error;
    return NextResponse.json({ presenters: data ?? [] });
  } catch (error) {
    console.error("PRESENTER ACCOUNTS ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch presenters." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { presenterId, email, password } = body;

    if (!presenterId || !email || !password) {
      return NextResponse.json({ error: "Presenter, email, and password required." }, { status: 400 });
    }

    // Create auth user
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: authData, error: authError } = await supabaseAuth.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Failed to create user.");

    // Link to presenter
    const admin = createAdminClient();
    const { error: linkError } = await admin
      .from("presenters")
      .update({ auth_user_id: authData.user.id, email })
      .eq("id", presenterId);

    if (linkError) throw linkError;

    return NextResponse.json({ userId: authData.user.id });
  } catch (error) {
    console.error("CREATE PRESENTER ACCOUNT ERROR:", error);
    const msg = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
