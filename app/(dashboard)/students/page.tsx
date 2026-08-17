import { PageHeader } from "@/components/ui/page-header";
import { StudentsView } from "@/components/students/students-view";
import { getStudents } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Search, filter, and review academic records across the current cohort."
      />
      <StudentsView students={students} />
    </div>
  );
}
