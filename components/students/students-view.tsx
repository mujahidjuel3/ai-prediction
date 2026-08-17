"use client";

import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { StudentIdentity } from "@/components/students/student-identity";
import { RiskBadge } from "@/components/ui/status-badges";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";
import { DEPARTMENTS, PAGE_SIZE, SEMESTERS } from "@/lib/constants";
import { formatGpa, formatPercent } from "@/lib/utils";
import type { RiskLevel } from "@/types/common";
import type { Student } from "@/types/student";
import Link from "next/link";
import { useMemo, useState } from "react";

interface StudentsViewProps {
  students: Student[];
}

export function StudentsView({ students }: StudentsViewProps) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [risk, setRisk] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesQuery =
        needle.length === 0 ||
        student.name.toLowerCase().includes(needle) ||
        student.studentId.toLowerCase().includes(needle);
      const matchesDepartment =
        department === "all" || student.department === department;
      const matchesSemester =
        semester === "all" || student.semester === Number(semester);
      const matchesRisk = risk === "all" || student.riskLevel === risk;
      return matchesQuery && matchesDepartment && matchesSemester && matchesRisk;
    });
  }, [students, query, department, semester, risk]);

  const { page, pageCount, pagedItems, setPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            id="student-search"
            label="Search"
            placeholder="Search by name or student ID"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
          <Select
            id="department-filter"
            label="Department"
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            options={[
              { label: "All departments", value: "all" },
              ...DEPARTMENTS.map((item) => ({ label: item, value: item })),
            ]}
          />
          <Select
            id="semester-filter"
            label="Semester"
            value={semester}
            onChange={(event) => {
              setSemester(event.target.value);
              setPage(1);
            }}
            options={[
              { label: "All semesters", value: "all" },
              ...SEMESTERS.map((item) => ({
                label: `Semester ${item}`,
                value: String(item),
              })),
            ]}
          />
          <Select
            id="risk-filter"
            label="Risk"
            value={risk}
            onChange={(event) => {
              setRisk(event.target.value as RiskLevel | "all");
              setPage(1);
            }}
            options={[
              { label: "All risk levels", value: "all" },
              { label: "High risk", value: "high" },
              { label: "Medium risk", value: "medium" },
              { label: "Low risk", value: "low" },
            ]}
          />
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title="No students match these filters"
            description="Adjust the search or filter criteria to see student records."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <THead>
                  <TR>
                    <TH>Student</TH>
                    <TH>Student ID</TH>
                    <TH>Department</TH>
                    <TH>Semester</TH>
                    <TH>GPA</TH>
                    <TH>Attendance</TH>
                    <TH>Risk</TH>
                    <TH>Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {pagedItems.map((student) => (
                    <TR key={student.id}>
                      <TD>
                        <StudentIdentity
                          name={student.name}
                          secondary={student.email}
                        />
                      </TD>
                      <TD>{student.studentId}</TD>
                      <TD>{student.department}</TD>
                      <TD>{student.semester}</TD>
                      <TD>{formatGpa(student.gpa)}</TD>
                      <TD>{formatPercent(student.attendance)}</TD>
                      <TD>
                        <RiskBadge level={student.riskLevel} />
                      </TD>
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
            <div className="space-y-3 p-4 md:hidden">
              {pagedItems.map((student) => (
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
                      <dt>Department</dt>
                      <dd className="font-medium text-slate-900">
                        {student.department}
                      </dd>
                    </div>
                    <div>
                      <dt>Semester</dt>
                      <dd className="font-medium text-slate-900">
                        {student.semester}
                      </dd>
                    </div>
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
            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
