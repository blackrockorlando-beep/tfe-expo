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

    const body = await request.json();

    if (body.action === "create") {
      const { data, error } = await admin.from("buyer_schedule_events").insert({
        buyer_id: buyer.id,
        brand_id: body.brandId || null,
        session_id: body.sessionId || null,
        event_type: body.eventType,
        title: body.title,
        description: body.description || null,
        scheduled_at: body.scheduledAt,
        duration_minutes: body.durationMinutes || 30,
        calendly_url: body.calendlyUrl || null,
        calendly_event_id: body.calendlyEventId || null,
        status: "scheduled",
      }).select("id").single();
      if (error) throw error;
      return NextResponse.json({ id: data.id });
    }

    if (body.action === "cancel") {
      await admin.from("buyer_schedule_events").update({ status: "cancelled" }).eq("id", body.eventId).eq("buyer_id", buyer.id);
      return NextResponse.json({ success: true });
    }

    if (body.action === "delete") {
      await admin.from("buyer_schedule_events").delete().eq("id", body.eventId).eq("buyer_id", buyer.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("SCHEDULE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
