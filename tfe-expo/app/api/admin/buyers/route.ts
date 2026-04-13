import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("buyers")
      .select("id, full_name, email, phone, state, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ buyers: data ?? [] });
  } catch (error) {
    console.error("ADMIN BUYERS ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch buyers." }, { status: 500 });
  }
}