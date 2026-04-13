import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: brands } = await supabase
      .from("brands")
      .select("id, name, category, logo_url, exhibitor_tier, investment_min, investment_max")
      .order("name");

    const { data: sessions } = await supabase
      .from("education_sessions")
      .select("id, title, scheduled_time, duration_minutes, is_live")
      .order("display_order");

    return NextResponse.json({
      brands: brands ?? [],
      sessions: sessions ?? [],
    });
  } catch (error) {
    console.error("PUBLIC EXPO INFO ERROR:", error);
    return NextResponse.json({ brands: [], sessions: [] });
  }
}
