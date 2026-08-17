import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getCourses } from "@/lib/api";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Monitor enrolment, average scores, and risk concentration by course."
      />
      <Card>
        <div className="hidden md:block">
          <Table>
            <THead>
              <TR>
                <TH>Course name</TH>
                <TH>Course code</TH>
                <TH>Department</TH>
                <TH>Students</TH>
                <TH>Average score</TH>
                <TH>Risk percentage</TH>
                <TH>Action</TH>
              </TR>
            </THead>
            <TBody>
              {courses.map((course) => (
                <TR key={course.id}>
                  <TD className="font-medium text-slate-900">{course.name}</TD>
                  <TD>{course.code}</TD>
                  <TD>{course.department}</TD>
                  <TD>{course.studentCount}</TD>
                  <TD>{formatPercent(course.averageScore)}</TD>
                  <TD>{formatPercent(course.riskPercentage)}</TD>
                  <TD>
                    <Link
                      href={`/courses/${course.id}`}
                      className={buttonClassName("outline", "sm")}
                    >
                      View
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="font-medium text-slate-900">{course.name}</p>
              <p className="text-xs text-slate-500">
                {course.code} · {course.department}
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
                <div>
                  <dt>Students</dt>
                  <dd className="font-medium text-slate-900">{course.studentCount}</dd>
                </div>
                <div>
                  <dt>Avg. score</dt>
                  <dd className="font-medium text-slate-900">
                    {formatPercent(course.averageScore)}
                  </dd>
                </div>
                <div>
                  <dt>Risk</dt>
                  <dd className="font-medium text-slate-900">
                    {formatPercent(course.riskPercentage)}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/courses/${course.id}`}
                className={`${buttonClassName("outline", "sm")} mt-3 w-full`}
              >
                View course
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
