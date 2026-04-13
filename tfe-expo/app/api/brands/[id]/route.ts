import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const supabase = createAdminClient();

    const { data: brand, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    if (!brand) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }

    const { data: validations, error: validationError } = await supabase
      .from("franchisee_validations")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    if (validationError) throw validationError;

    const { data: territories, error: territoryError } = await supabase
      .from("brand_territories")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    if (territoryError) throw territoryError;

    const { data: supportValues, error: supportError } = await supabase
      .from("brand_support_values")
      .select("provided, support_items(id, item_name, support_type, display_order)")
      .eq("brand_id", brand.id)
      .order("support_items(display_order)", { ascending: true });

    if (supportError) throw supportError;

    const { data: documents, error: documentError } = await supabase
      .from("brand_documents")
      .select("*")
      .eq("brand_id", brand.id)
      .order("display_order", { ascending: true });

    if (documentError) throw documentError;

    return NextResponse.json(
      {
        brand: {
          ...brand,
          franchisee_validations: validations ?? [],
          territories: territories ?? [],
          support_values: supportValues ?? [],
          documents: documents ?? [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("BRAND FETCH ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch brand." }, { status: 500 });
  }
}