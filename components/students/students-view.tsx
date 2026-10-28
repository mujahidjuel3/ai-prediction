"use client";

import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { StudentIdentity } from "@/components/students/student-identity";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { apiRequest, formatApiError, getErrorStatus, type StudentListItem } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function StudentsView() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => { setSearch(query.trim()); setPage(1); }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams({ page: String(page), pageSize: "25", sort: "name", order: "asc" });
    if (search) params.set("q", search);
    apiRequest<StudentListItem[]>(`/students?${params}`).then((response) => {
      if (!alive) return;
      setStudents(response.data);
      setPageCount(response.meta?.totalPages ?? 1);
    }).catch((reason: unknown) => {
      if (!alive) return;
      if (getErrorStatus(reason) === 401) router.replace("/login?reason=session-expired");
      else setError(formatApiError(reason));
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [page, search, router, retry]);

  return <div className="space-y-4">
    <Card className="p-4"><Input id="student-search" label="Search students" placeholder="Name or institutional student number" value={query} onChange={(event) => { setLoading(true); setError(null); setQuery(event.target.value); }} /></Card>
    {error ? <ErrorState title="Students could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} /> : null}
    {loading ? <LoadingState label="Loading students in your permitted scope" /> : error ? null : <Card>
      {students.length === 0 ? <EmptyState title="No matching students" description="There are no active students in this permitted scope for that search." /> : <>
        <div className="hidden md:block"><Table><THead><TR><TH>Student</TH><TH>Student number</TH><TH>Department</TH><TH>Enrollment year</TH><TH>Status</TH><TH>Action</TH></TR></THead><TBody>
          {students.map((student) => <TR key={student.id}><TD><StudentIdentity name={student.name} secondary={student.email ?? student.studentNumber} /></TD><TD>{student.studentNumber}</TD><TD>{student.department.name}</TD><TD>{student.enrollmentYear}</TD><TD>{student.status}</TD><TD><Link href={`/students/${student.id}`} className={buttonClassName("outline", "sm")}>View</Link></TD></TR>)}
        </TBody></Table></div>
        <div className="space-y-3 p-4 md:hidden">{students.map((student) => <div key={student.id} className="rounded-lg border border-slate-200 p-3"><StudentIdentity name={student.name} secondary={student.studentNumber} /><p className="mt-2 text-sm text-slate-600">{student.department.name} · {student.enrollmentYear}</p><Link href={`/students/${student.id}`} className={`${buttonClassName("outline", "sm")} mt-3 w-full`}>View student</Link></div>)}</div>
        <Pagination page={page} pageCount={pageCount} onPageChange={(nextPage) => { setLoading(true); setPage(nextPage); }} />
      </>}
    </Card>}
  </div>;
}
