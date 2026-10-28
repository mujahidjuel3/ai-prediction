import { CoursesView } from "@/components/courses/courses-view";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return <div className="space-y-6"><PageHeader title="Courses" description="Student enrollment records or course offerings visible to your account." /><CoursesView /></div>;
}
