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

    const { brandId, sessionId, noteText } = await request.json();

    const { data, error } = await admin.from("buyer_notes").insert({
      buyer_id: buyer.id,
      brand_id: brandId || null,
      session_id: sessionId || null,
      note_text: noteText,
    }).select("id").single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("NOTE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const { noteId } = await request.json();
    await admin.from("buyer_notes").delete().eq("id", noteId).eq("buyer_id", buyer.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTE DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
