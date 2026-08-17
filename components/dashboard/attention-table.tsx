import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentIdentity } from "@/components/students/student-identity";
import { RiskBadge } from "@/components/ui/status-badges";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDate, formatGpa, formatPercent } from "@/lib/utils";
import type { Student } from "@/types/student";
import Link from "next/link";

export function AttentionTable({ students }: { students: Student[] }) {
  const rows = students.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students requiring attention</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="hidden md:block">
          <Table>
            <THead>
              <TR>
                <TH>Student</TH>
                <TH>ID</TH>
                <TH>Department</TH>
                <TH>GPA</TH>
                <TH>Attendance</TH>
                <TH>Risk level</TH>
                <TH>Last updated</TH>
                <TH>Action</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((student) => (
                <TR key={student.id}>
                  <TD>
                    <StudentIdentity
                      name={student.name}
                      secondary={student.email}
                    />
                  </TD>
                  <TD>{student.studentId}</TD>
                  <TD>{student.department}</TD>
                  <TD>{formatGpa(student.gpa)}</TD>
                  <TD>{formatPercent(student.attendance)}</TD>
                  <TD>
                    <RiskBadge level={student.riskLevel} />
                  </TD>
                  <TD>{formatDate(student.lastUpdated)}</TD>
                  <TD>
                    <Link
                      href={`/students/${student.id}`}
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
        <div className="space-y-3 px-4 pb-4 md:hidden">
          {rows.map((student) => (
            <div
              key={student.id}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <StudentIdentity
                  name={student.name}
                  secondary={student.studentId}
                />
                <RiskBadge level={student.riskLevel} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>
                  <dt>GPA</dt>
                  <dd className="font-medium text-slate-900">
                    {formatGpa(student.gpa)}
                  </dd>
                </div>
                <div>
                  <dt>Attendance</dt>
                  <dd className="font-medium text-slate-900">
                    {formatPercent(student.attendance)}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/students/${student.id}`}
                className={`${buttonClassName("outline", "sm")} mt-3 w-full`}
              >
                View profile
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
