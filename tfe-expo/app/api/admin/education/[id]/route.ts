import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data: session, error } = await supabase
      .from("education_sessions")
      .select("*, presenters(*)")
      .eq("id", id)
      .single();
    if (error) throw error;

    const { data: slides } = await supabase
      .from("session_slides")
      .select("*")
      .eq("session_id", id)
      .order("display_order", { ascending: true });

    const { data: questions } = await supabase
      .from("session_questions")
      .select("*")
      .eq("session_id", id)
      .order("votes", { ascending: false });

    const { data: resources } = await supabase
      .from("session_resources")
      .select("*")
      .eq("session_id", id)
      .order("display_order", { ascending: true });

    return NextResponse.json({
      session,
      slides: slides ?? [],
      questions: questions ?? [],
      resources: resources ?? [],
    });
  } catch (error) {
    console.error("ADMIN EDUCATION GET ERROR:", error);
    return NextResponse.json({ error: "Unable to fetch session." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const body = await request.json();

    // Update session
    const { error: sessionError } = await supabase
      .from("education_sessions")
      .update({
        session_number: body.session_number,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        duration_minutes: body.duration_minutes,
        scheduled_time: body.scheduled_time,
        track: body.track,
        tags: body.tags,
        presenter_id: body.presenter_id || null,
        is_live: body.is_live,
        recording_available: body.recording_available,
        display_order: body.display_order,
      })
      .eq("id", id);
    if (sessionError) throw sessionError;

    // Replace slides
    await supabase.from("session_slides").delete().eq("session_id", id);
    if (body.slides?.length) {
      const { error: slidesError } = await supabase.from("session_slides").insert(
        body.slides.map((s: { tag: string; title: string; body: string; presenter_note: string; outline_label: string }, i: number) => ({
          session_id: id,
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

    // Replace resources
    await supabase.from("session_resources").delete().eq("session_id", id);
    if (body.resources?.length) {
      const { error: resError } = await supabase.from("session_resources").insert(
        body.resources.map((r: { title: string; description: string; file_type: string }, i: number) => ({
          session_id: id,
          title: r.title,
          description: r.description,
          file_type: r.file_type,
          display_order: i + 1,
        }))
      );
      if (resError) throw resError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN EDUCATION UPDATE ERROR:", error);
    const msg = error instanceof Error ? error.message : "Unable to update session.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const { error } = await supabase.from("education_sessions").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN EDUCATION DELETE ERROR:", error);
    return NextResponse.json({ error: "Unable to delete session." }, { status: 500 });
  }
}
