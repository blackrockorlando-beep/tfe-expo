import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const buyerId = url.searchParams.get("buyerId");
    if (!buyerId) return NextResponse.json({ error: "buyerId required" }, { status: 400 });

    const supabase = createAdminClient();

    const { data: buyer } = await supabase.from("buyers").select("id, full_name, email, category_interests, ownership_model, investment_range").eq("id", buyerId).single();
    const { data: brands } = await supabase.from("brands").select("id, name, category, ownership_model, investment_min, investment_max, logo_url").order("name");
    const { data: manualMatches } = await supabase.from("buyer_manual_matches").select("brand_id, match_type").eq("buyer_id", buyerId);
    const { data: statuses } = await supabase.from("buyer_brand_status").select("brand_id, status").eq("buyer_id", buyerId);

    const manualMap: Record<string, string> = {};
    (manualMatches ?? []).forEach((m) => { manualMap[m.brand_id] = m.match_type; });

    const statusMap: Record<string, string> = {};
    (statuses ?? []).forEach((s) => { statusMap[s.brand_id] = s.status; });

    const notInterestedIds = new Set(Object.entries(statusMap).filter(([, v]) => v === "not_interested").map(([k]) => k));
    const autoMatched = (brands ?? []).filter((b) => {
      if (notInterestedIds.has(b.id)) return false;
      const catMatch = !buyer?.category_interests?.length || buyer.category_interests.includes(b.category);
      const modelMatch = !buyer?.ownership_model || buyer.ownership_model === "open" || buyer.ownership_model === b.ownership_model;
      const budgetMatch = !buyer?.investment_range || b.investment_min <= (buyer.investment_range * 1000);
      if (buyer?.category_interests?.length && !catMatch) return false;
      return budgetMatch || modelMatch;
    }).map((b) => b.id);

    return NextResponse.json({
      buyer,
      brands: brands ?? [],
      manualMap,
      autoMatchIds: autoMatched,
      statusMap,
    });
  } catch (error) {
    console.error("BUYER MATCHES ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const { buyerId, brandId, action } = await request.json();

    if (action === "include") {
      await supabase.from("buyer_manual_matches").upsert(
        { buyer_id: buyerId, brand_id: brandId, match_type: "include" },
        { onConflict: "buyer_id,brand_id" }
      );
    } else if (action === "exclude") {
      await supabase.from("buyer_manual_matches").upsert(
        { buyer_id: buyerId, brand_id: brandId, match_type: "exclude" },
        { onConflict: "buyer_id,brand_id" }
      );
    } else if (action === "reset") {
      await supabase.from("buyer_manual_matches").delete().eq("buyer_id", buyerId).eq("brand_id", brandId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BUYER MATCH UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}