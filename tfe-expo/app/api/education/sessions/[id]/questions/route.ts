import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    let buyerId = null;
    if (user) {
      const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
      buyerId = buyer?.id ?? null;
    }

    const body = await request.json();

    if (body.action === "ask") {
      const { data, error } = await admin.from("session_questions").insert({
        session_id: sessionId,
        question_text: body.questionText,
        votes: 1,
        buyer_id: buyerId,
      }).select("id, question_text, votes, is_answered, answer_text, answered_by, created_at").single();

      if (error) throw error;
      return NextResponse.json({ question: data });
    }

    if (body.action === "vote") {
      const { error } = await admin.rpc("increment_question_votes", { question_id: body.questionId });
      if (error) {
        // Fallback: direct update
        await admin.from("session_questions").update({
          votes: body.currentVotes + 1,
        }).eq("id", body.questionId);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("QA ERROR:", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
