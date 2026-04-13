import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    // Find presenter by auth_user_id
    const { data: presenter } = await admin
      .from("presenters")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (!presenter) return NextResponse.json({ error: "Not a presenter" }, { status: 403 });

    // Get sessions for this presenter
    const { data: sessions } = await admin
      .from("education_sessions")
      .select("id, session_number, title, subtitle, scheduled_time, duration_minutes, is_live, recording_available, display_order")
      .eq("presenter_id", presenter.id)
      .order("display_order");

    // Get registrant counts per session
    const sessionIds = (sessions ?? []).map((s) => s.id);
    let registrantCounts: Record<string, number> = {};
    if (sessionIds.length > 0) {
      const { data: signups } = await admin
        .from("buyer_session_signups")
        .select("session_id")
        .in("session_id", sessionIds);

      (signups ?? []).forEach((s) => {
        registrantCounts[s.session_id] = (registrantCounts[s.session_id] ?? 0) + 1;
      });
    }

    return NextResponse.json({
      presenter,
      sessions: (sessions ?? []).map((s) => ({ ...s, registrant_count: registrantCounts[s.id] ?? 0 })),
    });
  } catch (error) {
    console.error("PRESENTER SESSIONS ERROR:", error);
    return NextResponse.json({ error: "Unable to load sessions." }, { status: 500 });
  }
}
