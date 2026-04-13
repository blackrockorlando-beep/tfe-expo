import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const { sessionId, action } = await request.json();

    if (action === "register") {
      await admin.from("buyer_session_signups").upsert(
        { buyer_id: buyer.id, session_id: sessionId, status: "registered" },
        { onConflict: "buyer_id,session_id" }
      );
      // Also create a schedule event
      const { data: session } = await admin.from("education_sessions").select("title, scheduled_time, duration_minutes").eq("id", sessionId).single();
      if (session) {
        await admin.from("buyer_schedule_events").upsert({
          buyer_id: buyer.id, session_id: sessionId, event_type: "education_session",
          title: session.title, scheduled_at: new Date().toISOString(),
          duration_minutes: session.duration_minutes, status: "scheduled",
        }, { onConflict: "buyer_id,session_id" }).select();
      }
    } else if (action === "cancel") {
      await admin.from("buyer_session_signups").delete().eq("buyer_id", buyer.id).eq("session_id", sessionId);
      await admin.from("buyer_schedule_events").delete().eq("buyer_id", buyer.id).eq("session_id", sessionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SESSION SIGNUP ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
