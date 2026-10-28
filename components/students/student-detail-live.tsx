"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { apiData, formatApiError, type AcademicSummary, type AssessmentScore, type AttendanceRecord, type RiskAlert, type StoredPrediction, type StudentProfile, type StudentRecords } from "@/lib/api";
import { useSessionUser } from "@/components/layout/dashboard-shell";
import { useEffect, useState } from "react";

interface DetailData { profile: StudentProfile; scores: AssessmentScore[]; attendance: AttendanceRecord[]; summaries: AcademicSummary[]; predictions: StoredPrediction[]; alerts: RiskAlert[]; }

export function StudentDetailLive({ studentId }: { studentId: string }) {
  const user = useSessionUser();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    const load = async () => {
      if (user.role === "STUDENT") {
        const [profile, records] = await Promise.all([
          apiData<StudentProfile>("/students/me"),
          apiData<StudentRecords>("/students/me/records"),
        ]);
        if (profile.id !== studentId) throw new Error("Student access is restricted to your own linked profile.");
        return { profile, scores: records.scores, attendance: records.attendance, summaries: [], predictions: [], alerts: [] };
      }
      const [profile, scores] = await Promise.all([
        apiData<StudentProfile>(`/students/${encodeURIComponent(studentId)}`),
        apiData<AssessmentScore[]>(`/students/${encodeURIComponent(studentId)}/records`),
      ]);
      const offerings = [...new Map(profile.enrollments.map(({ offering }) => [offering.id, offering])).values()];
      const attendanceRows = await Promise.all(offerings.map(async (offering) => {
        const rows = await apiData<Array<Omit<AttendanceRecord, "offering">>>(`/attendance?offeringId=${encodeURIComponent(offering.id)}&studentId=${encodeURIComponent(studentId)}`);
        return rows.map((row) => ({ ...row, offering }));
      }));
      return {
        profile,
        scores,
        attendance: attendanceRows.flat(),
        summaries: profile.summaries ?? [],
        predictions: profile.predictions ?? [],
        alerts: profile.alerts ?? [],
      };
    };
    load().then((value) => { if (alive) setData(value); }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user, studentId, retry]);

  if (loading) return <LoadingState label="Loading permitted student records" />;
  if (error) return <ErrorState title="Student records could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} />;
  if (!data) return <EmptyState title="Student profile unavailable" description="No profile data was returned for this request." />;
  const { profile, scores, attendance, summaries, predictions, alerts } = data;

  return <div className="space-y-6">
    <PageHeader title={profile.name} description="Academic records returned by the authenticated API for this student and role." />
    <Card><CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"><Avatar name={profile.name} size="lg" /><div><p className="text-xl font-semibold text-slate-900">{profile.name}</p><p className="text-sm text-slate-500">{profile.studentNumber} · {profile.department.name}</p><p className="text-sm text-slate-500">Enrollment year {profile.enrollmentYear} · {profile.status}</p>{user?.role === "STUDENT" && profile.email ? <p className="text-sm text-slate-500">{profile.email}</p> : null}</div></CardContent></Card>

    <Card><CardHeader><CardTitle>Enrolled offerings</CardTitle><CardDescription>Offerings included in the profile response. Teacher results are constrained by backend assignment scope.</CardDescription></CardHeader><CardContent>
      {profile.enrollments.length ? <ul className="divide-y divide-slate-100">{profile.enrollments.map(({ id, status, offering }) => <li key={id} className="py-3"><p className="font-medium text-slate-900">{offering.course.code} · {offering.course.name}</p><p className="text-sm text-slate-500">{offering.term.label} · Section {offering.section} · {status}</p></li>)}</ul> : <EmptyState title="No offering records" description="No enrollment records were returned." />}
    </CardContent></Card>

    {summaries.length > 0 ? <Card><CardHeader><CardTitle>Stored academic summaries</CardTitle><CardDescription>Values are shown only when persisted summary records are returned by the API.</CardDescription></CardHeader><CardContent className="space-y-2">{summaries.map((summary) => <div key={summary.id} className="grid grid-cols-2 gap-2 rounded border border-slate-100 p-3 text-sm sm:grid-cols-4"><span>{summary.term?.label ?? summary.termId}</span><span>GPA: {summary.gpa ?? "Not recorded"}</span><span>Attendance: {summary.attendancePercent == null ? "Not recorded" : `${summary.attendancePercent}%`}</span><span>Assessment average: {summary.assessmentAverage ?? "Not recorded"}</span><p className="col-span-full text-xs text-slate-500">Calculation version: {summary.calculationVersion}</p></div>)}</CardContent></Card> : <Card><CardHeader><CardTitle>Academic summaries</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-600">No authorized stored summary is available. This view does not calculate GPA or attendance rates.</p></CardContent></Card>}

    <section className="grid gap-6 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Attendance records</CardTitle></CardHeader><CardContent>{attendance.length ? <ul className="divide-y divide-slate-100">{attendance.map((record) => <li key={record.id} className="flex justify-between gap-3 py-2 text-sm"><span>{record.offering.course.code} · {new Date(record.sessionDate).toLocaleDateString()}</span><span>{record.status}</span></li>)}</ul> : <EmptyState title="No attendance records" description="No attendance entries were returned from permitted offerings." />}</CardContent></Card>
      <Card><CardHeader><CardTitle>Assessment scores</CardTitle></CardHeader><CardContent>{scores.length ? <ul className="divide-y divide-slate-100">{scores.map((score) => <li key={score.id} className="flex justify-between gap-3 py-2 text-sm"><span>{score.assessment.offering.course.code} · {score.assessment.name}</span><span>{score.score ?? "Not graded"} / {score.assessment.maxScore}</span></li>)}</ul> : <EmptyState title="No recorded scores" description="Assessment scores will appear here when returned by the API." />}</CardContent></Card>
    </section>

    <Card><CardHeader><CardTitle>Prediction history</CardTitle><CardDescription>Only stored outputs exposed by this role are shown; no estimate is generated in the frontend.</CardDescription></CardHeader><CardContent>{user?.role === "STUDENT" ? <p className="text-sm text-slate-600">The current API does not provide student prediction access. No prediction is shown.</p> : predictions.length ? <ul className="divide-y divide-slate-100">{predictions.map((prediction) => <li key={prediction.id} className="py-3 text-sm"><p className="font-medium">{prediction.riskLevel} · {prediction.term?.label ?? prediction.termId}</p><p className="text-slate-600">Stored probability: {prediction.probability ?? "Not recorded"} · Model {prediction.modelVersion?.version ?? "unknown"}</p><p className="text-xs text-slate-500">{prediction.modelVersion?.targetDefinition ?? "Target definition unavailable"} · {new Date(prediction.generatedAt).toLocaleString()}</p></li>)}</ul> : <p className="text-sm text-slate-600">No authorized prediction history is stored for this student. Generation is unavailable until an approved model and policy are configured.</p>}</CardContent></Card>

    <Card><CardHeader><CardTitle>Alerts</CardTitle></CardHeader><CardContent>{user?.role === "STUDENT" ? <p className="text-sm text-slate-600">Student alert access is not exposed by the current API.</p> : alerts.length ? <ul className="divide-y divide-slate-100">{alerts.map((alert) => <li key={alert.id} className="py-3 text-sm"><p className="font-medium">{alert.severity} · {alert.category} · {alert.status}</p><p>{alert.reason}</p><p className="text-xs text-slate-500">{alert.term?.label ?? alert.termId} · {new Date(alert.createdAt).toLocaleString()}</p></li>)}</ul> : <p className="text-sm text-slate-600">No authorized alert records were returned.</p>}</CardContent></Card>
  </div>;
}
