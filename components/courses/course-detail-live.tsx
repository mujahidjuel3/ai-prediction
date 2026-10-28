"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { apiData, ApiError, formatApiError, type AttendanceRecord, type CourseOffering, type StudentProfile, type StudentRecords } from "@/lib/api";
import { useSessionUser } from "@/components/layout/dashboard-shell";
import { useEffect, useState } from "react";

interface EnrollmentRow { id: string; status: string; student: { id: string; studentNumber: string; name: string }; }
interface AssessmentRow { id: string; name: string; kind: string; maxScore: number | string; weight: number | string | null; dueAt: string | null; }
interface OfferingRecords { offering: CourseOffering; enrollments: EnrollmentRow[]; assessments: AssessmentRow[]; attendance: AttendanceRecord[]; scores: Array<{ assessmentId: string; assessmentName: string; maxScore: number | string; student: { id: string; name: string; studentNumber: string }; score: number | string | null }>; }

export function CourseDetailLive({ offeringId }: { offeringId: string }) {
  const user = useSessionUser();
  const [data, setData] = useState<OfferingRecords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const load = async (): Promise<OfferingRecords> => {
      if (user.role === "STUDENT") {
        const [profile, records] = await Promise.all([apiData<StudentProfile>("/students/me"), apiData<StudentRecords>("/students/me/records")]);
        const enrollment = profile.enrollments.find((entry) => entry.offering.id === offeringId);
        if (!enrollment) throw new ApiError("This course is not part of your linked student profile.", 403);
        return {
          offering: enrollment.offering,
          enrollments: [],
          assessments: [],
          attendance: records.attendance.filter((record) => record.offering.id === offeringId),
          scores: records.scores.filter((score) => score.assessment.offering.id === offeringId).map((score) => ({ assessmentId: score.assessment.id, assessmentName: score.assessment.name, maxScore: score.assessment.maxScore, student: { id: profile.id, name: profile.name, studentNumber: profile.studentNumber }, score: score.score })),
        };
      }
      const offerings = await apiData<CourseOffering[]>("/courses");
      const offering = offerings.find((entry) => entry.id === offeringId);
      if (!offering) throw new ApiError("This offering is outside your permitted scope or does not exist.", 403);
      const [enrollments, assessments, attendanceRows] = await Promise.all([
        apiData<EnrollmentRow[]>(`/offerings/${encodeURIComponent(offeringId)}/enrollments`),
        apiData<AssessmentRow[]>(`/offerings/${encodeURIComponent(offeringId)}/assessments`),
        apiData<Array<Omit<AttendanceRecord, "offering">>>(`/attendance?offeringId=${encodeURIComponent(offeringId)}`),
      ]);
      const scoreRows = await Promise.all(assessments.map((assessment) => apiData<Array<{ assessmentId: string; student: { id: string; name: string; studentNumber: string }; score: number | string | null }>>(`/assessments/${encodeURIComponent(assessment.id)}/scores`)));
      return { offering, enrollments, assessments, attendance: attendanceRows.map((row) => ({ ...row, offering })), scores: scoreRows.flat().map((row) => ({ ...row, assessmentName: assessments.find((assessment) => assessment.id === row.assessmentId)?.name ?? row.assessmentId, maxScore: assessments.find((assessment) => assessment.id === row.assessmentId)?.maxScore ?? "—" })) };
    };
    load().then((value) => { if (alive) setData(value); }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user, offeringId, retry]);

  if (loading) return <LoadingState label="Loading permitted course records" />;
  if (error) return <ErrorState title="Course records could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} />;
  if (!data) return <EmptyState title="Offering unavailable" description="No course offering was returned." />;
  const { offering } = data;
  return <div className="space-y-6"><PageHeader title={`${offering.course.code} · ${offering.course.name}`} description={`${offering.course.department.name} · ${offering.term.label} · Section ${offering.section}`} />
    {user?.role === "STUDENT" ? <>
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>My attendance</CardTitle><CardDescription>Attendance entries belonging to this offering.</CardDescription></CardHeader><CardContent>{data.attendance.length ? <ul className="divide-y divide-slate-100">{data.attendance.map((row) => <li key={row.id} className="flex justify-between py-2 text-sm"><span>{new Date(row.sessionDate).toLocaleDateString()}</span><span>{row.status}</span></li>)}</ul> : <EmptyState title="No attendance records" description="No attendance entries are recorded for this offering." />}</CardContent></Card>
        <Card><CardHeader><CardTitle>My scores</CardTitle><CardDescription>Recorded scores and their original assessment maximums.</CardDescription></CardHeader><CardContent>{data.scores.length ? <ul className="divide-y divide-slate-100">{data.scores.map((row, index) => <li key={`${row.assessmentId}-${index}`} className="flex justify-between gap-2 py-2 text-sm"><span>{row.assessmentName}</span><span>{row.score ?? "Not graded"} / {row.maxScore}</span></li>)}</ul> : <EmptyState title="No scores recorded" description="Scores will appear here after they are saved." />}</CardContent></Card>
      </section>
    </> : <>
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Enrollments</CardTitle><CardDescription>Students returned for this assigned or administered offering.</CardDescription></CardHeader><CardContent>{data.enrollments.length ? <ul className="divide-y divide-slate-100">{data.enrollments.map((row) => <li key={row.id} className="flex justify-between py-2 text-sm"><span>{row.student.name} · {row.student.studentNumber}</span><span>{row.status}</span></li>)}</ul> : <EmptyState title="No enrollments" description="No enrollment records were returned." />}</CardContent></Card>
        <Card><CardHeader><CardTitle>Assessments</CardTitle></CardHeader><CardContent>{data.assessments.length ? <ul className="divide-y divide-slate-100">{data.assessments.map((row) => <li key={row.id} className="py-2 text-sm"><p className="font-medium">{row.name} · {row.kind}</p><p className="text-slate-500">Maximum score: {row.maxScore} · Weight: {row.weight ?? "Not set"}</p></li>)}</ul> : <EmptyState title="No assessments" description="No assessment definitions were returned." />}</CardContent></Card>
      </section>
      <Card><CardHeader><CardTitle>Recorded scores</CardTitle><CardDescription>Scores returned by each assessment endpoint for this offering.</CardDescription></CardHeader><CardContent>{data.scores.length ? <ul className="divide-y divide-slate-100">{data.scores.map((row, index) => <li key={`${row.assessmentId}-${row.student.id}-${index}`} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><span>{row.student.name} · {row.student.studentNumber}</span><span>{row.score ?? "Not graded"}</span></li>)}</ul> : <EmptyState title="No recorded scores" description="No score records were returned for these assessments." />}</CardContent></Card>
      <Card><CardHeader><CardTitle>Attendance</CardTitle></CardHeader><CardContent>{data.attendance.length ? <ul className="divide-y divide-slate-100">{data.attendance.map((row) => <li key={row.id} className="flex justify-between py-2 text-sm"><span>{row.offering.course.code} · {new Date(row.sessionDate).toLocaleDateString()}</span><span>{row.status}</span></li>)}</ul> : <EmptyState title="No attendance records" description="No attendance entries were returned." />}</CardContent></Card>
    </>}
  </div>;
}
