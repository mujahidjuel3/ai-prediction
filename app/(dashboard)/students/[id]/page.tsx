"use client";

import { StudentDetailLive } from "@/components/students/student-detail-live";
import { useParams } from "next/navigation";

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  return <StudentDetailLive studentId={params.id} />;
}
