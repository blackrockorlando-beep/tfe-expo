import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Step5Payload = {
  buyerId?: string;
  goals?: string[];
  brokerHistory?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Step5Payload;
    const { buyerId, goals, brokerHistory } = body;

    if (!buyerId || !goals?.length || !brokerHistory) {
      return NextResponse.json(
        { error: "Goals and broker history are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("buyers")
      .update({
        goals,
        broker_history: brokerHistory,
        registration_complete: true,
      })
      .eq("id", buyerId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("STEP5 ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Unable to complete registration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}