import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: sessions, error } = await supabase
      .from("education_sessions")
      .select("*, presenters(full_name, initials)")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sessions: sessions ?? [] });
  } catch (error) {
    console.error("EDUCATION SESSIONS ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch sessions." }, { status: 500 });
  }
}
