import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") ?? "summary";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("*").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    if (type === "summary") {
      const { data: brands } = await admin.from("brands").select("id, name, slug, category, ownership_model, investment_min, investment_max, unit_count, description, calendly_link, logo_url, exhibitor_tier, hero_image_url").order("name");
      const { data: saved } = await admin.from("buyer_saved_brands").select("brand_id").eq("buyer_id", buyer.id);
      const { data: statuses } = await admin.from("buyer_brand_status").select("brand_id, status").eq("buyer_id", buyer.id);
      const { data: interactions } = await admin.from("buyer_brand_interactions").select("brand_id, interaction_type, created_at").eq("buyer_id", buyer.id);
      const { data: sessions } = await admin.from("education_sessions").select("id, session_number, title, scheduled_time, duration_minutes, is_live, recording_available").order("display_order");
      const { data: signups } = await admin.from("buyer_session_signups").select("session_id, status, attended,score, completed_at").eq("buyer_id", buyer.id);
      const { data: events } = await admin.from("buyer_schedule_events").select("*").eq("buyer_id", buyer.id).order("scheduled_at");

      const savedIds = (saved ?? []).map((s) => s.brand_id);
      const statusMap: Record<string, string> = {};
      (statuses ?? []).forEach((s) => { statusMap[s.brand_id] = s.status; });
      const signupMap: Record<string, { status: string; attended: boolean; score?: number; completed_at?: string }> = {};
signups.forEach((s: any) => { signupMap[s.session_id] = { status: s.status, attended: s.attended, score: s.score ?? undefined, completed_at: s.completed_at ?? undefined }; });

      // Match brands by buyer preferences
      const notInterestedIds = new Set(Object.entries(statusMap).filter(([, v]) => v === "not_interested").map(([k]) => k));
      const allBrands = brands ?? [];
      // Get manual matches (includes and excludes)
      const { data: manualMatches } = await admin.from("buyer_manual_matches").select("brand_id, match_type").eq("buyer_id", buyer.id);
      const manualIncludeIds = new Set((manualMatches ?? []).filter((m) => m.match_type === "include").map((m) => m.brand_id));
      const manualExcludeIds = new Set((manualMatches ?? []).filter((m) => m.match_type === "exclude").map((m) => m.brand_id));

      // Brands the buyer marked as interested
      const interestedIds = new Set(Object.entries(statusMap).filter(([, v]) => v === "interested").map(([k]) => k));

      const matched = allBrands.filter((b) => {
        if (notInterestedIds.has(b.id)) return false;
        if (manualExcludeIds.has(b.id)) return false;
        if (manualIncludeIds.has(b.id)) return true;
        if (interestedIds.has(b.id)) return true;
        const catMatch = !buyer.category_interests?.length || buyer.category_interests.includes(b.category);
        const modelMatch = !buyer.ownership_model || buyer.ownership_model === "open" || buyer.ownership_model === b.ownership_model;
        const budgetMatch = !buyer.investment_range || b.investment_min <= (buyer.investment_range * 1000);
        if (buyer.category_interests?.length && !catMatch) return false;
        return budgetMatch || modelMatch;
      });

      return NextResponse.json({
        buyer, brands: allBrands, matched, savedIds, statusMap,
        interactions: interactions ?? [], sessions: sessions ?? [],
        signupMap, events: events ?? [],
      });
    }

    if (type === "saved") {
      const { data: saved } = await admin.from("buyer_saved_brands")
        .select("brand_id, created_at, brands(id, name, slug, category, ownership_model, investment_min, investment_max, description)")
        .eq("buyer_id", buyer.id).order("created_at", { ascending: false });
      return NextResponse.json({ saved: saved ?? [] });
    }

    if (type === "notes") {
      const { data: notes } = await admin.from("buyer_notes")
        .select("*, brands(name), education_sessions(title)")
        .eq("buyer_id", buyer.id).order("updated_at", { ascending: false });
      return NextResponse.json({ notes: notes ?? [] });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json({ error: "Unable to load dashboard." }, { status: 500 });
  }
}
