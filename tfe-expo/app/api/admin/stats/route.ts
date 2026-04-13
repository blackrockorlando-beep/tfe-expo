import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { count: brandCount } = await supabase.from("brands").select("*", { count: "exact", head: true });
    const { count: buyerCount } = await supabase.from("buyers").select("*", { count: "exact", head: true });
    const { count: sessionCount } = await supabase.from("education_sessions").select("*", { count: "exact", head: true });
    const { count: signupCount } = await supabase.from("buyer_session_signups").select("*", { count: "exact", head: true });
    const { count: connectCount } = await supabase.from("buyer_schedule_events").select("*", { count: "exact", head: true }).eq("event_type", "speed_connect");
    const { count: interestedCount } = await supabase.from("buyer_brand_status").select("*", { count: "exact", head: true }).eq("status", "interested");
    const { count: pavilionViews } = await supabase.from("buyer_brand_interactions").select("*", { count: "exact", head: true }).eq("interaction_type", "pavilion_view");
    const { count: presenterCount } = await supabase.from("presenters").select("*", { count: "exact", head: true });

    // Pavilion views by brand
    const { data: views } = await supabase
      .from("buyer_brand_interactions")
      .select("brand_id, brands(name, logo_url)")
      .eq("interaction_type", "pavilion_view");

    const brandViews: Record<string, { name: string; logo_url: string | null; count: number }> = {};
    (views ?? []).forEach((v: { brand_id: string; brands: { name: string; logo_url: string | null } }) => {
      if (!brandViews[v.brand_id]) {
        brandViews[v.brand_id] = { name: v.brands.name, logo_url: v.brands.logo_url, count: 0 };
      }
      brandViews[v.brand_id].count++;
    });

    const brandViewsList = Object.entries(brandViews)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      brands: brandCount ?? 0,
      buyers: buyerCount ?? 0,
      sessions: sessionCount ?? 0,
      signups: signupCount ?? 0,
      connects: connectCount ?? 0,
      interested: interestedCount ?? 0,
      pavilionViews: pavilionViews ?? 0,
      presenters: presenterCount ?? 0,
      brandViews: brandViewsList,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json({ error: "Unable to load stats." }, { status: 500 });
  }
}