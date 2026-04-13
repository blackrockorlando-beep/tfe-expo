import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data: brand, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    const { data: territories } = await supabase
      .from("brand_territories")
      .select("*")
      .eq("brand_id", id)
      .order("display_order", { ascending: true });

    const { data: supportValues } = await supabase
      .from("brand_support_values")
      .select("provided, support_items(id, item_name, support_type)")
      .eq("brand_id", id);

    const { data: documents } = await supabase
      .from("brand_documents")
      .select("*")
      .eq("brand_id", id)
      .order("display_order", { ascending: true });

    const { data: validations } = await supabase
      .from("franchisee_validations")
      .select("*")
      .eq("brand_id", id)
      .order("display_order", { ascending: true });

    return NextResponse.json({
      brand: {
        ...brand,
        territories: territories ?? [],
        support_values: supportValues ?? [],
        documents: documents ?? [],
        franchisee_validations: validations ?? [],
      },
    }, { status: 200 });
  } catch (error) {
    console.error("ADMIN BRAND FETCH ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch brand." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const body = await request.json();

    const { error: brandError } = await supabase
      .from("brands")
      .update({
        name: body.name,
        slug: body.slug,
        category: body.category,
        description: body.description,
        ownership_model: body.ownershipModel,
        tags: body.tags,
        overview: body.overview,
        investment_min: body.investmentMin,
        investment_max: body.investmentMax,
        franchise_fee: body.franchiseFee,
        royalty_pct: body.royaltyPct,
        auv: body.auv,
        payback_period: body.paybackPeriod,
        liquid_capital_required: body.liquidCapital,
        sba_eligible: body.sbaEligible,
        item19_present: body.item19Present,
        item19_fiscal_year: body.item19FiscalYear,
        item19_locations_reporting: body.item19LocationsReporting,
        item19_summary: body.item19Summary,
        item19_median_gross: body.item19MedianGross,
        item19_top_quartile_gross: body.item19TopQuartile,
        item19_bottom_quartile_gross: body.item19BottomQuartile,
        item19_avg_net_revenue: body.item19AvgNet,
        item19_notes: body.item19Notes,
        item19_pnl: body.pnlRows,
        location_type: body.locationType,
        operating_hours: body.operatingHours,
        staff_at_open: body.staffAtOpen,
        revenue_mix: body.revenueMix,
        unit_count: body.unitCount,
        years_franchising: body.yearsFranchising,
        territory_description: body.territoryDescription,
        support_onthejob_hours: body.onthejobHours,
        support_classroom_hours: body.classroomHours,
        rep_name: body.repName,
        rep_title: body.repTitle,
        rep_availability: body.repAvailability,
        pitch_time: body.pitchTime,
        pitch_stage: body.pitchStage,
        pitch_duration: body.pitchDuration,
        exhibitor_tier: body.exhibitorTier,
        calendly_link: body.calendlyLink,
      })
      .eq("id", id);

    if (brandError) throw brandError;

    // Replace territories
    await supabase.from("brand_territories").delete().eq("brand_id", id);
    if (body.territories?.length) {
      await supabase.from("brand_territories").insert(
        body.territories.map((t: { name: string; status: string }, i: number) => ({
          brand_id: id, territory_name: t.name, status: t.status, display_order: i + 1,
        }))
      );
    }

    // Replace support values
    await supabase.from("brand_support_values").delete().eq("brand_id", id);
    const { data: supportItems } = await supabase.from("support_items").select("id, item_name");
    if (supportItems?.length) {
      const allSelected = [...(body.ongoingSupport ?? []), ...(body.marketingSupport ?? [])];
      await supabase.from("brand_support_values").insert(
        supportItems.map((si) => ({ brand_id: id, support_item_id: si.id, provided: allSelected.includes(si.item_name) }))
      );
    }

    // Replace documents
    await supabase.from("brand_documents").delete().eq("brand_id", id);
    if (body.documents?.length) {
      await supabase.from("brand_documents").insert(
        body.documents.map((d: { title: string; description: string; access_type: string }, i: number) => ({
          brand_id: id, title: d.title, description: d.description, access_type: d.access_type, display_order: i + 1,
        }))
      );
    }

    // Replace validations
    await supabase.from("franchisee_validations").delete().eq("brand_id", id);
    if (body.validations?.length) {
      await supabase.from("franchisee_validations").insert(
        body.validations.map((v: { initials: string; name: string; location: string; months_open: number; quote: string; rating: number }, i: number) => ({
          brand_id: id, initials: v.initials, name: v.name, location: v.location, months_open: v.months_open, quote: v.quote, rating: v.rating, display_order: i + 1,
        }))
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("ADMIN BRAND UPDATE ERROR:", error);
    const msg = error instanceof Error ? error.message : "Unable to update brand.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
