import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Step2Payload = {
  buyerId?: string;
  investmentRange?: number;
  liquidCapital?: string;
  sbaLoan?: string;
  robsInterest?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Step2Payload;
    const { buyerId, investmentRange, liquidCapital, sbaLoan, robsInterest } =
      body;

    if (!buyerId || !liquidCapital || !sbaLoan || !robsInterest) {
      return NextResponse.json(
        { error: "All investment fields are required." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("buyers")
      .update({
        investment_range: investmentRange,
        liquid_capital: liquidCapital,
        sba_loan: sbaLoan,
        robs_interest: robsInterest,
      })
      .eq("id", buyerId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("STEP2 ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save investment details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}