import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer, error } = await admin
      .from("buyers")
      .select("*")
      .eq("email", user.email!.toLowerCase())
      .single();

    if (error) throw error;
    return NextResponse.json({ buyer });
  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json({ error: "Unable to load profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const { data: buyer } = await admin.from("buyers").select("id").eq("email", user.email!.toLowerCase()).single();
    if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const body = await request.json();

    const { error } = await admin
      .from("buyers")
      .update({
        full_name: body.full_name,
        phone: body.phone,
        state: body.state,
        investment_range: body.investment_range,
        liquid_capital: body.liquid_capital,
        sba_loan: body.sba_loan,
        robs_interest: body.robs_interest,
        background: body.background,
        years_experience: body.years_experience,
        ownership_model: body.ownership_model,
        category_interests: body.category_interests,
        decision_timeline: body.decision_timeline,
        goals: body.goals,
        broker_history: body.broker_history,
      })
      .eq("id", buyer.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
