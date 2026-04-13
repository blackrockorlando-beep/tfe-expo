import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("education_sessions")
      .select("*, presenters(id, full_name, initials)")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ sessions: data ?? [] });
  } catch (error) {
    console.error("ADMIN EDUCATION LIST ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch sessions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from("education_sessions")
      .insert({
        session_number: body.session_number,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        duration_minutes: body.duration_minutes,
        scheduled_time: body.scheduled_time,
        track: body.track ?? "Education",
        tags: body.tags ?? [],
        presenter_id: body.presenter_id || null,
        is_live: body.is_live ?? false,
        recording_available: body.recording_available ?? false,
        display_order: body.display_order ?? 1,
      })
      .select("id")
      .single();

    if (sessionError) throw sessionError;

    // Insert slides
    if (body.slides?.length) {
      const { error: slidesError } = await supabase.from("session_slides").insert(
        body.slides.map((s: { tag: string; title: string; body: string; presenter_note: string; outline_label: string }, i: number) => ({
          session_id: session.id,
          slide_number: i + 1,
          tag: s.tag,
          title: s.title,
          body: s.body,
          presenter_note: s.presenter_note,
          outline_label: s.outline_label,
          display_order: i + 1,
        }))
      );
      if (slidesError) throw slidesError;
    }

    // Insert resources
    if (body.resources?.length) {
      const { error: resError } = await supabase.from("session_resources").insert(
        body.resources.map((r: { title: string; description: string; file_type: string }, i: number) => ({
          session_id: session.id,
          title: r.title,
          description: r.description,
          file_type: r.file_type,
          display_order: i + 1,
        }))
      );
      if (resError) throw resError;
    }

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error) {
    console.error("ADMIN EDUCATION CREATE ERROR:", error);
    const msg = error instanceof Error ? error.message : "Unable to create session.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
