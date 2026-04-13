import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, brandId } = body;

    if (!email || !password || !brandId) {
      return NextResponse.json({ error: "Email, password, and brand are required." }, { status: 400 });
    }

    // Create auth user using Supabase Admin API
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Failed to create user.");

    // Link to brand
    const admin = createAdminClient();
    const { error: linkError } = await admin
      .from("brands")
      .update({ franchisor_user_id: authData.user.id })
      .eq("id", brandId);

    if (linkError) throw linkError;

    return NextResponse.json({ userId: authData.user.id }, { status: 200 });
  } catch (error) {
    console.error("CREATE FRANCHISOR ACCOUNT ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to create account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}