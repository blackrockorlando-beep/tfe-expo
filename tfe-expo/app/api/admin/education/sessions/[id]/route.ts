import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    // Fetch session with presenter
    const { data: session, error: sessionError } = await supabase
      .from("education_sessions")
      .select("*, presenters(*)")
      .eq("id", id)
      .single();

    if (sessionError) throw sessionError;

    // Fetch slides
    const { data: slides } = await supabase
      .from("session_slides")
      .select("*")
      .eq("session_id", id)
      .order("display_order", { ascending: true });

    // Fetch questions
    const { data: questions } = await supabase
      .from("session_questions")
      .select("*")
      .eq("session_id", id)
      .order("votes", { ascending: false });

    // Fetch resources
    const { data: resources } = await supabase
      .from("session_resources")
      .select("*")
      .eq("session_id", id)
      .order("display_order", { ascending: true });

    // Fetch all sessions for sidebar
    const { data: allSessions } = await supabase
      .from("education_sessions")
      .select("id, session_number, title, scheduled_time, duration_minutes, is_live")
      .order("display_order", { ascending: true });

    return NextResponse.json({
      session,
      slides: slides ?? [],
      questions: questions ?? [],
      resources: resources ?? [],
      allSessions: allSessions ?? [],
    });
  } catch (error) {
    console.error("EDUCATION SESSION ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch session." }, { status: 500 });
  }
}
