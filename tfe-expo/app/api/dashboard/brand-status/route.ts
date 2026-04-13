import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const { brandId, status } = await request.json();

    if (status === "remove") {
      await admin.from("buyer_brand_status").delete().eq("buyer_id", buyer.id).eq("brand_id", brandId);
    } else {
      await admin.from("buyer_brand_status").upsert(
        { buyer_id: buyer.id, brand_id: brandId, status, updated_at: new Date().toISOString() },
        { onConflict: "buyer_id,brand_id" }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BRAND STATUS ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
