"use client";

import { useParams } from "next/navigation";
import EducationSessionForm from "../EducationSessionForm";

export default function EditEducationSessionPage() {
  const params = useParams();
  const id = params.id as string;
  return <EducationSessionForm sessionId={id} />;
}
