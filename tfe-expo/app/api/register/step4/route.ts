import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Step4Payload = {
  buyerId?: string;
  ownershipModel?: string;
  categoryInterests?: string[];
  timeline?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Step4Payload;
    const { buyerId, ownershipModel, categoryInterests, timeline } = body;

    if (!buyerId || !ownershipModel || !timeline) {
      return NextResponse.json(
        { error: "Ownership model and timeline are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("buyers")
      .update({
        ownership_model: ownershipModel,
        category_interests: categoryInterests ?? [],
        decision_timeline: timeline,
      })
      .eq("id", buyerId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("STEP4 ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save preferences.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}