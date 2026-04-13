import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    const { data: brand } = await admin.from("brands").select("id, name, logo_url, exhibitor_tier").eq("franchisor_user_id", user.id).single();
    if (!brand) return NextResponse.json({ error: "No brand assigned" }, { status: 403 });

    // Interested buyers
    const { data: interested } = await admin
      .from("buyer_brand_status")
      .select("status, updated_at, buyers(id, full_name, email, phone, state, ownership_model, investment_range, decision_timeline)")
      .eq("brand_id", brand.id).eq("status", "interested").order("updated_at", { ascending: false });

    // Not interested count
    const { count: notInterestedCount } = await admin
      .from("buyer_brand_status")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brand.id).eq("status", "not_interested");

    // Saved by buyers
    const { data: saved } = await admin
      .from("buyer_saved_brands")
      .select("created_at, buyers(id, full_name, email, state)")
      .eq("brand_id", brand.id).order("created_at", { ascending: false });

    // Pavilion views (all)
    const { data: allViews } = await admin
      .from("buyer_brand_interactions")
      .select("created_at, buyers(id, full_name, email, state)")
      .eq("brand_id", brand.id).eq("interaction_type", "pavilion_view")
      .order("created_at", { ascending: false });

    // Unique pavilion viewers
    const uniqueViewerIds = new Set((allViews ?? []).map((v) => v.buyers?.id).filter(Boolean));

    // Speed connect requests
    const { data: speedConnects } = await admin
      .from("buyer_schedule_events")
      .select("*, buyers(id, full_name, email, phone, state)")
      .eq("brand_id", brand.id).eq("event_type", "speed_connect")
      .order("created_at", { ascending: false });

    const scheduledConnects = (speedConnects ?? []).filter((c) => c.status === "scheduled");
    const completedConnects = (speedConnects ?? []).filter((c) => c.status === "completed");
    const cancelledConnects = (speedConnects ?? []).filter((c) => c.status === "cancelled");

    // Auto-matched buyers (buyers whose preferences match this brand)
    const { data: allBuyers } = await admin.from("buyers").select("id, full_name, email, state, category_interests, ownership_model, investment_range").eq("registration_complete", true);
    const autoMatchedBuyers = (allBuyers ?? []).filter((b) => {
      const catMatch = !b.category_interests?.length || b.category_interests.includes(brand.name); // This is rough - better to check category
      return true; // We'll count all registered buyers for now as potential
    });

    // Buyers who have this brand in their matched list (via manual include)
    const { data: manualIncludes } = await admin
      .from("buyer_manual_matches")
      .select("buyer_id, match_type, buyers(id, full_name, email, state)")
      .eq("brand_id", brand.id);

    const adminIncluded = (manualIncludes ?? []).filter((m) => m.match_type === "include");
    const adminExcluded = (manualIncludes ?? []).filter((m) => m.match_type === "exclude");

    // Session signups if this brand has education sessions
    const { data: brandSessions } = await admin
      .from("education_sessions")
      .select("id, title")
      .eq("brand_id", brand.id);

    let sessionSignups = 0;
    let sessionAttended = 0;
    if (brandSessions?.length) {
      const sessionIds = brandSessions.map((s) => s.id);
      const { count: signupCount } = await admin
        .from("buyer_session_signups")
        .select("*", { count: "exact", head: true })
        .in("session_id", sessionIds);
      const { count: attendedCount } = await admin
        .from("buyer_session_signups")
        .select("*", { count: "exact", head: true })
        .in("session_id", sessionIds)
        .eq("attended", true);
      sessionSignups = signupCount ?? 0;
      sessionAttended = attendedCount ?? 0;
    }

    const stats = {
      interestedCount: (interested ?? []).length,
      notInterestedCount: notInterestedCount ?? 0,
      savedCount: (saved ?? []).length,
      totalPavilionViews: (allViews ?? []).length,
      uniquePavilionViewers: uniqueViewerIds.size,
      speedConnectRequests: (speedConnects ?? []).length,
      speedConnectScheduled: scheduledConnects.length,
      speedConnectCompleted: completedConnects.length,
      speedConnectCancelled: cancelledConnects.length,
      adminIncluded: adminIncluded.length,
      adminExcluded: adminExcluded.length,
      sessionSignups,
      sessionAttended,
      totalRegisteredBuyers: (allBuyers ?? []).length,
    };

    return NextResponse.json({
      brand,
      stats,
      interested: interested ?? [],
      saved: saved ?? [],
      views: allViews ?? [],
      speedConnects: speedConnects ?? [],
    });
  } catch (error) {
    console.error("FRANCHISOR LEADS ERROR:", error);
    return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
  }
}
