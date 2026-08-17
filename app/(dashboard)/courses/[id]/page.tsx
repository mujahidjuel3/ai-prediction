import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentIdentity } from "@/components/students/student-identity";
import { RiskBadge } from "@/components/ui/status-badges";
import { getCourseById, getStudents } from "@/lib/api";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/courses/[id]">): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);
  return {
    title: course ? course.name : "Course",
  };
}

export default async function CourseDetailPage({
  params,
}: PageProps<"/courses/[id]">) {
  const { id } = await params;
  const [course, students] = await Promise.all([getCourseById(id), getStudents()]);

  if (!course) notFound();

  const enrolled = students.filter((student) =>
    course.enrolledStudentIds.includes(student.id),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.name}</CardTitle>
          <CardDescription>
            {course.code} · {course.department}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">{course.description}</p>
          <dl className="grid grid-cols-1 gap-3 xs:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Students</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {course.studentCount}
              </dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Average score</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {formatPercent(course.averageScore)}
              </dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Risk percentage</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">
                {formatPercent(course.riskPercentage)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrolled.map((student) => (
            <div
              key={student.id}
              className="flex flex-col gap-3 rounded-md border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <StudentIdentity name={student.name} secondary={student.studentId} />
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge level={student.riskLevel} />
                <Link
                  href={`/students/${student.id}`}
                  className={buttonClassName("outline", "sm")}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
