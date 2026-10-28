"use client";

import { CourseDetailLive } from "@/components/courses/course-detail-live";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  return <CourseDetailLive offeringId={params.id} />;
}
