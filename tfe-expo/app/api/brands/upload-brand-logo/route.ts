import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const brandId = formData.get("brandId") as string;

    if (!file || !brandId) {
      return NextResponse.json({ error: "File and brandId required." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const fileName = `${brandId}/logo.${ext}`;

    // Delete existing logo if any
    await supabase.storage.from("brand-logos").remove([fileName]);

    const { data, error } = await supabase.storage
      .from("brand-logos")
      .upload(fileName, file, { contentType: file.type, upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(data.path);

    // Save URL to brands table
    await supabase.from("brands").update({ logo_url: urlData.publicUrl }).eq("id", brandId);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("LOGO UPLOAD ERROR:", error);
    const msg = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}