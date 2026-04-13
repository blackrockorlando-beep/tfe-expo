import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: brands, error } = await supabase
      .from("brands")
      .select("id, name, slug, category, ownership_model, investment_min, investment_max, available_states, item19_present, sba_eligible, unit_count")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ brands: brands ?? [] }, { status: 200 });
  } catch (error) {
    console.error("BRANDS LIST ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch brands." }, { status: 500 });
  }
}