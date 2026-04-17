import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { sessionId, score } = await req.json();
  if (!sessionId || typeof score !== "number") {
    return NextResponse.json({ error: "Missing sessionId or score" }, { status: 400 });
  }

  // Get buyer id from email
  const { data: buyer } = await supabase.from("buyers").select("id").eq("email", user.email).single();
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  // Upsert the signup with score
  const { error } = await supabase.from("buyer_session_signups")
    .upsert({
      buyer_id: buyer.id,
      session_id: sessionId,
      status: "registered",
      attended: true,
      score: Math.min(100, Math.max(0, Math.round(score))),
      completed_at: new Date().toISOString(),
    }, { onConflict: "buyer_id,session_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}