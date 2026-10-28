"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { apiData, formatApiError, type CourseOffering, type StudentProfile } from "@/lib/api";
import { useSessionUser } from "@/components/layout/dashboard-shell";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface CourseRow { offeringId: string; course: CourseOffering["course"]; term: CourseOffering["term"]; section: string; teacher?: CourseOffering["teacher"]; enrollmentCount?: number; status?: string; }

export function CoursesView() {
  const user = useSessionUser();
  const [rows, setRows] = useState<CourseRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const load = async () => {
      if (user.role === "STUDENT") {
        const profile = await apiData<StudentProfile>("/students/me");
        return profile.enrollments.map(({ id, status, offering }) => ({ offeringId: offering.id ?? id, course: offering.course, term: offering.term, section: offering.section, teacher: offering.teacher, status }));
      }
      const offerings = await apiData<CourseOffering[]>("/courses");
      return offerings.map((offering) => ({ offeringId: offering.id, course: offering.course, term: offering.term, section: offering.section, teacher: offering.teacher, enrollmentCount: offering._count?.enrollments }));
    };
    load().then((value) => { if (alive) setRows(value); }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user, retry]);
  const visible = useMemo(() => rows.filter((row) => `${row.course.code} ${row.course.name} ${row.course.department.name} ${row.term.label}`.toLowerCase().includes(query.trim().toLowerCase())), [rows, query]);

  if (loading) return <LoadingState label="Loading course offerings" />;
  if (error) return <ErrorState title="Courses could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} />;
  return <div className="space-y-4"><Card className="p-4"><Input id="course-search" label="Search offerings" placeholder="Course, department, or term" value={query} onChange={(event) => setQuery(event.target.value)} /></Card>
    {visible.length === 0 ? <Card><EmptyState title="No course offerings found" description="No matching active enrollment or permitted offering was returned." /></Card> : <div className="grid gap-3">{visible.map((row) => <Card key={row.offeringId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{row.course.code} · {row.course.name}</p><p className="text-sm text-slate-500">{row.course.department.name} · {row.term.label} · Section {row.section}</p><p className="text-xs text-slate-500">{row.status ? `Enrollment: ${row.status}` : `${row.enrollmentCount ?? "—"} enrollment records`} · Teacher: {row.teacher?.name ?? "Not assigned"}</p></div><Link href={`/courses/${row.offeringId}`} className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">View course records</Link></Card>)}</div>}
  </div>;
}
