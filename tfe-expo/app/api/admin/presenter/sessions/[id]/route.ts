import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();

    // Verify presenter owns this session
    const { data: presenter } = await admin.from("presenters").select("id").eq("auth_user_id", user.id).single();
    if (!presenter) return NextResponse.json({ error: "Not a presenter" }, { status: 403 });

    const { data: session } = await admin
      .from("education_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("presenter_id", presenter.id)
      .single();

    if (!session) return NextResponse.json({ error: "Session not found or not yours" }, { status: 404 });

    // Get registrants
    const { data: registrants } = await admin
      .from("buyer_session_signups")
      .select("status, attended, created_at, buyers(id, full_name, email, phone, state, ownership_model, investment_range)")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    // Get questions
    const { data: questions } = await admin
      .from("session_questions")
      .select("*")
      .eq("session_id", sessionId)
      .order("votes", { ascending: false });

    return NextResponse.json({
      session,
      registrants: registrants ?? [],
      questions: questions ?? [],
      stats: {
        total: (registrants ?? []).length,
        attended: (registrants ?? []).filter((r) => r.attended).length,
        questions: (questions ?? []).length,
        unanswered: (questions ?? []).filter((q) => !q.is_answered).length,
      },
    });
  } catch (error) {
    console.error("PRESENTER SESSION DETAIL ERROR:", error);
    return NextResponse.json({ error: "Unable to load session." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: presenter } = await admin.from("presenters").select("id").eq("auth_user_id", user.id).single();
    if (!presenter) return NextResponse.json({ error: "Not a presenter" }, { status: 403 });

    const body = await request.json();

    // Answer a question
    if (body.action === "answer_question") {
      await admin.from("session_questions").update({
        is_answered: true,
        answer_text: body.answerText,
        answered_by: body.answeredBy,
      }).eq("id", body.questionId);
      return NextResponse.json({ success: true });
    }

    // Mark attendance
    if (body.action === "toggle_attendance") {
      await admin.from("buyer_session_signups").update({ attended: body.attended })
        .eq("session_id", sessionId).eq("buyer_id", body.buyerId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PRESENTER SESSION UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
