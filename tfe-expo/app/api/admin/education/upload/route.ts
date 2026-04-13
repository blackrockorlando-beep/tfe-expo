import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!file || !sessionId) {
      return NextResponse.json({ error: "File and sessionId required." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const fileName = `${sessionId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("education-resources")
      .upload(fileName, file, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("education-resources")
      .getPublicUrl(data.path);

    return NextResponse.json({
      path: data.path,
      url: urlData.publicUrl,
      fileName: file.name,
      fileType: ext?.toUpperCase() ?? "FILE",
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    const msg = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}