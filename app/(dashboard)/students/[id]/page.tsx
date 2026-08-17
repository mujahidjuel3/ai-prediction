import { StudentDetail } from "@/components/students/student-detail";
import { getAlertsByStudent, getStudentById } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/students/[id]">): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudentById(id);
  return {
    title: student ? student.name : "Student",
  };
}

export default async function StudentDetailPage({
  params,
}: PageProps<"/students/[id]">) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) notFound();

  const alerts = await getAlertsByStudent(student.id);

  return <StudentDetail student={student} alerts={alerts} />;
}
