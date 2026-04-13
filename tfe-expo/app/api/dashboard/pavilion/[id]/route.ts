import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();

    const { data: brand, error } = await admin.from("brands").select("*").eq("id", id).single();
    if (error || !brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

    const { data: territories } = await admin.from("brand_territories").select("*").eq("brand_id", id).order("display_order");
    const { data: documents } = await admin.from("brand_documents").select("*").eq("brand_id", id).order("display_order");
    const { data: validations } = await admin.from("franchisee_validations").select("*").eq("brand_id", id).order("display_order");
    const { data: supportValues } = await admin.from("brand_support_values").select("provided, support_items(item_name, support_type)").eq("brand_id", id);

    // Track pavilion view
    if (buyer) {
      await admin.from("buyer_brand_interactions").insert({
        buyer_id: buyer.id, brand_id: id, interaction_type: "pavilion_view",
      });
    }

    // Get buyer's status for this brand
    let buyerStatus = null;
    let isSaved = false;
    if (buyer) {
      const { data: status } = await admin.from("buyer_brand_status").select("status").eq("buyer_id", buyer.id).eq("brand_id", id).single();
      buyerStatus = status?.status ?? null;
      const { data: saved } = await admin.from("buyer_saved_brands").select("id").eq("buyer_id", buyer.id).eq("brand_id", id).single();
      isSaved = !!saved;
    }

    return NextResponse.json({
      brand: { ...brand, territories: territories ?? [], documents: documents ?? [], validations: validations ?? [], support_values: supportValues ?? [] },
      buyerStatus, isSaved,
    });
  } catch (error) {
    console.error("PAVILION ERROR:", error);
    return NextResponse.json({ error: "Unable to load brand." }, { status: 500 });
  }
}
