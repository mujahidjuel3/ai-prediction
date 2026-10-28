import { StudentsView } from "@/components/students/students-view";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Students" };

export default function StudentsPage() {
  return <div className="space-y-6"><PageHeader title="Students" description="Search and review active students visible in your role's permitted academic scope." /><StudentsView /></div>;
}
