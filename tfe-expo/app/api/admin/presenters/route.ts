import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("presenters").select("*").order("full_name");
    if (error) throw error;
    return NextResponse.json({ presenters: data ?? [] });
  } catch (error) {
    console.error("PRESENTERS ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch presenters." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from("presenters")
      .insert({ initials: body.initials, full_name: body.full_name, title: body.title, organization: body.organization, avatar_color: body.avatar_color ?? "#BE123C" })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("PRESENTER CREATE ERROR:", error);
    return NextResponse.json({ error: "Unable to create presenter." }, { status: 500 });
  }
}
