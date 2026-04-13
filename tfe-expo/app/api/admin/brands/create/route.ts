import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .insert({
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
        item19_cogs_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("cost"))?.amount,
        item19_cogs_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("cost"))?.pct,
        item19_artist_commissions_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("labor") || r.label.toLowerCase().includes("commission"))?.amount,
        item19_artist_commissions_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("labor") || r.label.toLowerCase().includes("commission"))?.pct,
        item19_rent_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("rent"))?.amount,
        item19_rent_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("rent"))?.pct,
        item19_royalty_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("royalty"))?.amount,
        item19_royalty_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("royalty"))?.pct,
        item19_labor_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("labor") || r.label.toLowerCase().includes("commission"))?.amount,
        item19_labor_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("labor") || r.label.toLowerCase().includes("commission"))?.pct,
        item19_other_expenses_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("other"))?.amount,
        item19_other_expenses_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("other"))?.pct,
        item19_owner_earnings_amount: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("owner") || r.label.toLowerCase().includes("ebitda"))?.amount,
        item19_owner_earnings_pct: body.pnlRows?.find((r: {label: string}) => r.label.toLowerCase().includes("owner") || r.label.toLowerCase().includes("ebitda"))?.pct,
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
      })
      .select("id")
      .single();

    if (brandError) throw brandError;
    const brandId = brand.id;

    if (body.territories?.length) {
      const { error: terrError } = await supabase
        .from("brand_territories")
        .insert(
          body.territories.map((t: { name: string; status: string }, i: number) => ({
            brand_id: brandId,
            territory_name: t.name,
            status: t.status,
            display_order: i + 1,
          }))
        );
      if (terrError) throw terrError;
    }

    const { data: supportItems } = await supabase
      .from("support_items")
      .select("id, item_name");

    if (supportItems?.length) {
      const allSelected = [...body.ongoingSupport, ...body.marketingSupport];
      const { error: supportError } = await supabase
        .from("brand_support_values")
        .insert(
          supportItems.map((si) => ({
            brand_id: brandId,
            support_item_id: si.id,
            provided: allSelected.includes(si.item_name),
          }))
        );
      if (supportError) throw supportError;
    }

    if (body.documents?.length) {
      const { error: docError } = await supabase
        .from("brand_documents")
        .insert(
          body.documents.map((d: { title: string; description: string; access_type: string }, i: number) => ({
            brand_id: brandId,
            title: d.title,
            description: d.description,
            access_type: d.access_type,
            display_order: i + 1,
          }))
        );
      if (docError) throw docError;
    }

    return NextResponse.json({ brandId }, { status: 200 });
  } catch (error) {
    console.error("CREATE BRAND ERROR:", error);
    const message = error instanceof Error ? error.message : "Unable to create brand.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}