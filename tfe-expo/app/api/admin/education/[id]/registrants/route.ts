import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    // Get session info
    const { data: session } = await supabase
      .from("education_sessions")
      .select("id, title, session_number, scheduled_time, duration_minutes, presenters(full_name)")
      .eq("id", id)
      .single();

    // Get registrants with buyer details
    const { data: registrants, error } = await supabase
      .from("buyer_session_signups")
      .select("status, attended, created_at, buyers(id, full_name, email, phone, state, ownership_model, investment_range)")
      .eq("session_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const stats = {
      total: (registrants ?? []).length,
      registered: (registrants ?? []).filter((r) => r.status === "registered").length,
      attended: (registrants ?? []).filter((r) => r.attended).length,
    };

    return NextResponse.json({ session, registrants: registrants ?? [], stats });
  } catch (error) {
    console.error("REGISTRANTS ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch registrants." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await context.params;
    const supabase = createAdminClient();
    const { buyerId, attended } = await request.json();

    await supabase
      .from("buyer_session_signups")
      .update({ attended })
      .eq("session_id", sessionId)
      .eq("buyer_id", buyerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
