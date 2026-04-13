import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Step3Payload = {
  buyerId?: string;
  background?: string;
  yearsExperience?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Step3Payload;
    const { buyerId, background, yearsExperience } = body;

    if (!buyerId || !background || !yearsExperience) {
      return NextResponse.json(
        { error: "All background fields are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("buyers")
      .update({
        professional_background: background,
        years_experience: yearsExperience,
      })
      .eq("id", buyerId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("STEP3 ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save background details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}