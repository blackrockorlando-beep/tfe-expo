import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    // Get all speed connect events for this buyer
    const { data: connects } = await admin
      .from("buyer_schedule_events")
      .select("*")
      .eq("buyer_id", buyer.id)
      .eq("event_type", "speed_connect")
      .order("created_at", { ascending: false });

    return NextResponse.json({ connects: connects ?? [] });
  } catch (error) {
    console.error("SPEED CONNECT GET ERROR:", error);
    return NextResponse.json({ error: "Failed to load." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const body = await request.json();
    const { brandId, brandName, action } = body;

    if (action === "cancel") {
      // Cancel a speed connect
      const { error } = await admin
        .from("buyer_schedule_events")
        .update({ status: "cancelled" })
        .eq("id", body.eventId)
        .eq("buyer_id", buyer.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Create speed connect request
    const { data: event, error } = await admin
      .from("buyer_schedule_events")
      .insert({
        buyer_id: buyer.id,
        brand_id: brandId,
        title: `Speed Connect — ${brandName}`,
        event_type: "speed_connect",
        scheduled_at: new Date().toISOString(),
        duration_minutes: 10,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ event });
  } catch (error) {
    console.error("SPEED CONNECT POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create." }, { status: 500 });
  }
}
