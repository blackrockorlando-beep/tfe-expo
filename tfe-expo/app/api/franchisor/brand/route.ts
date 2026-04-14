import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: brand, error } = await admin
      .from("brands")
      .select("*")
      .eq("franchisor_user_id", user.id)
      .single();

    if (error || !brand) {
      return NextResponse.json({ brand: null }, { status: 200 });
    }

    const { data: territories } = await admin
      .from("brand_territories")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    const { data: supportValues } = await admin
      .from("brand_support_values")
      .select("provided, support_items(id, item_name, support_type)")
      .eq("brand_id", brand.id);

    const { data: documents } = await admin
      .from("brand_documents")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    const { data: validations } = await admin
      .from("franchisee_validations")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    return NextResponse.json({
      brand: {
        ...brand,
        territories: territories ?? [],
        support_values: supportValues ?? [],
        documents: documents ?? [],
        validations: validations ?? [],
      },
    });
  } catch (error) {
    console.error("FRANCHISOR BRAND ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch brand." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    const { data: brand } = await admin
      .from("brands")
      .select("id")
      .eq("franchisor_user_id", user.id)
      .single();

    if (!brand) return NextResponse.json({ error: "No brand assigned." }, { status: 403 });

    const body = await request.json();

    // Update brand
    const { error: updateError } = await admin
      .from("brands")
      .update({
        name: body.name,
        slug: body.slug,
        category: body.category,
        description: body.description,
        ownership_model: body.ownership_model,
        tags: body.tags,
        overview: body.overview,
        calendly_link: body.calendly_link,
        investment_min: body.investment_min,
        investment_max: body.investment_max,
        franchise_fee: body.franchise_fee,
        royalty_pct: body.royalty_pct,
        auv: body.auv,
        payback_period: body.payback_period,
        liquid_capital_required: body.liquid_capital_required,
        sba_eligible: body.sba_eligible,
        item19_present: body.item19_present,
        item19_fiscal_year: body.item19_fiscal_year,
        item19_locations_reporting: body.item19_locations_reporting,
        item19_summary: body.item19_summary,
        item19_median_gross: body.item19_median_gross,
        item19_top_quartile_gross: body.item19_top_quartile_gross,
        item19_bottom_quartile_gross: body.item19_bottom_quartile_gross,
        item19_avg_net_revenue: body.item19_avg_net_revenue,
        item19_notes: body.item19_notes,
        item19_pnl: body.item19_pnl,
        location_type: body.location_type,
        operating_hours: body.operating_hours,
        staff_at_open: body.staff_at_open,
        revenue_mix: body.revenue_mix,
        unit_count: body.unit_count,
        years_franchising: body.years_franchising,
        territory_description: body.territory_description,
        support_onthejob_hours: body.support_onthejob_hours,
        support_classroom_hours: body.support_classroom_hours,
        rep_name: body.rep_name,
        rep_title: body.rep_title,
        rep_availability: body.rep_availability,
        pitch_time: body.pitch_time,
        pitch_stage: body.pitch_stage,
        pitch_duration: body.pitch_duration,
      })
      .eq("id", brand.id);

    if (updateError) throw updateError;

    // Update territories
    await admin.from("brand_territories").delete().eq("brand_id", brand.id);
    if (body.territories?.length) {
      await admin.from("brand_territories").insert(
        body.territories.map((t: { name: string; status: string }, i: number) => ({
          brand_id: brand.id,
          territory_name: t.name,
          status: t.status,
          display_order: i + 1,
        }))
      );
    }

    // Update documents
    await admin.from("brand_documents").delete().eq("brand_id", brand.id);
    if (body.documents?.length) {
      await admin.from("brand_documents").insert(
        body.documents.map((d: { title: string; description: string; access_type: string; file_url?: string }, i: number) => ({
          brand_id: brand.id,
          title: d.title,
          description: d.description,
          access_type: d.access_type,
          file_url: d.file_url || null,
          display_order: i + 1,
        }))
      );
    }

    // Update validations
    await admin.from("franchisee_validations").delete().eq("brand_id", brand.id);
    if (body.validations?.length) {
      await admin.from("franchisee_validations").insert(
        body.validations.map((v: { initials: string; name: string; location: string; months_open: number; quote: string; rating: number }, i: number) => ({
          brand_id: brand.id,
          initials: v.initials,
          name: v.name,
          location: v.location,
          months_open: v.months_open,
          quote: v.quote,
          rating: v.rating,
          display_order: i + 1,
        }))
      );
    }

    // Update support values
    if (body.support_ongoing || body.support_marketing) {
      const { data: allItems } = await admin
        .from("support_items")
        .select("id, item_name, support_type");

      if (allItems?.length) {
        await admin.from("brand_support_values").delete().eq("brand_id", brand.id);

        const supportRows = allItems.map((item) => ({
          brand_id: brand.id,
          support_item_id: item.id,
          provided:
            (item.support_type === "ongoing" && (body.support_ongoing ?? []).includes(item.item_name)) ||
            (item.support_type === "marketing" && (body.support_marketing ?? []).includes(item.item_name)),
        }));

        await admin.from("brand_support_values").insert(supportRows);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FRANCHISOR BRAND SAVE ERROR:", error);
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }
}
