import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Step1Payload = {
  fullName?: string;
  email?: string;
  phone?: string;
  state?: string;
  authUserId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Step1Payload;
    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim() || null;
    const state = body.state?.trim();
    const authUserId = body.authUserId || null;

    if (!fullName || !email || !state) {
      return NextResponse.json(
        { error: "Full name, email, and state are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: existingBuyer, error: existingBuyerError } = await supabase
      .from("buyers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingBuyerError) throw existingBuyerError;

    const payload = {
      full_name: fullName,
      email,
      phone,
      state,
      ...(authUserId ? { auth_user_id: authUserId } : {}),
    };

    if (existingBuyer?.id) {
      const { data: updatedBuyer, error: updateError } = await supabase
        .from("buyers")
        .update(payload)
        .eq("id", existingBuyer.id)
        .select("id")
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ buyerId: updatedBuyer.id }, { status: 200 });
    }

    const { data: insertedBuyer, error: insertError } = await supabase
      .from("buyers")
      .insert(payload)
      .select("id")
      .single();

    if (insertError) throw insertError;
    return NextResponse.json({ buyerId: insertedBuyer.id }, { status: 200 });
  } catch (error) {
    console.error("STEP1 ERROR:", error);
    const message = error instanceof Error ? error.message : "Unable to save registration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}