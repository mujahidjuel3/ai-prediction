"use client";

import { apiData, apiRequest, formatApiError, getErrorStatus, type AnalyticsSummary, type CourseOffering, type DashboardSummary, type NotificationItem, type StudentProfile, type StudentRecords } from "@/lib/api";
import { useSessionUser } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import Link from "next/link";
import { Activity, Bell, BookOpen, GraduationCap, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function LiveDashboard() {
  const user = useSessionUser();
  const [data, setData] = useState<{
    summary?: DashboardSummary;
    analytics?: AnalyticsSummary;
    alerts?: Array<{ id: string; reason: string; status: string; severity: string; createdAt: string; student?: { id: string; name: string; studentNumber: string } }>;
    offerings?: CourseOffering[];
    student?: StudentProfile;
    records?: StudentRecords;
    notificationCount?: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError(null);
    try {
      if (user.role === "STUDENT") {
        let student: StudentProfile;
        try { student = await apiData<StudentProfile>("/students/me"); }
        catch (reason) { if (getErrorStatus(reason) === 404) { setData({}); return; } throw reason; }
        const [records, notificationPage] = await Promise.all([
          apiData<StudentRecords>("/students/me/records"),
          apiRequest<NotificationItem[]>("/notifications?page=1&pageSize=5"),
        ]);
        setData({ student, records, notificationCount: notificationPage.meta?.total ?? notificationPage.data.length });
      } else {
        const [summary, analytics, alerts, offerings] = await Promise.all([
          user.role === "ADMIN" ? apiData<DashboardSummary>("/dashboard/summary") : Promise.resolve(undefined),
          apiData<AnalyticsSummary>("/analytics/summary"),
          apiData<Array<{ id: string; reason: string; status: string; severity: string; createdAt: string; student?: { id: string; name: string; studentNumber: string } }>>("/alerts?page=1&pageSize=5"),
          apiData<CourseOffering[]>("/courses"),
        ]);
        setData({ summary, analytics, alerts, offerings });
      }
    } catch (reason) {
      setError(formatApiError(reason));
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load, attempt]);

  if (loading) return <LoadingState label="Loading your academic information" />;
  if (error) return <ErrorState title="Dashboard data is unavailable" description={error} onRetry={() => { setLoading(true); setError(null); setAttempt((value) => value + 1); }} />;

  if (user?.role === "STUDENT") {
    const enrolled = data.student?.enrollments.filter((item) => item.status === "ENROLLED") ?? [];
    const attendanceCount = data.records?.attendance.length ?? 0;
    const scoresCount = data.records?.scores.length ?? 0;
    return <div className="space-y-6">
      <PageHeader title={`Welcome, ${data.student?.name ?? user.name}`} description="Your enrolled courses, recorded attendance, scores and messages." />
      {!data.student ? <EmptyState title="Student profile is not linked" description="Ask an administrator to link this login to your academic profile." /> : <>
        <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Enrolled courses" value={enrolled.length} icon={BookOpen} />
          <StatCard label="Attendance entries" value={attendanceCount} icon={Activity} />
          <StatCard label="Recorded scores" value={scoresCount} icon={GraduationCap} />
          <StatCard label="In-app messages" value={data.notificationCount ?? 0} icon={Bell} />
        </section>
        <Card><CardHeader><CardTitle>My courses</CardTitle><CardDescription>Course offerings returned for your linked student profile.</CardDescription></CardHeader><CardContent>
          {enrolled.length ? <ul className="divide-y divide-slate-100">{enrolled.map(({ id, offering }) => <li key={id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="font-medium text-slate-900">{offering.course.code} · {offering.course.name}</p><p className="text-sm text-slate-500">{offering.term.label} · Section {offering.section}</p></div><Link className="text-sm font-medium text-primary" href={`/courses/${offering.id}`}>View records</Link></li>)}</ul> : <EmptyState title="No active course enrollments" description="Enrolled course information will appear here when available." />}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Prediction availability</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-600">Student prediction access is not provided by the current API. No prediction or risk estimate is shown here.</p></CardContent></Card>
      </>}
    </div>;
  }

  const analytics = data.analytics;
  const openAlerts = user?.role === "ADMIN"
    ? data.summary?.openAlerts ?? 0
    : analytics?.alertsBySeverityAndStatus.filter((row) => row.status !== "RESOLVED").reduce((total, row) => total + row._count, 0) ?? 0;
  return <div className="space-y-6">
    <PageHeader title="Academic overview" description={user?.role === "TEACHER" ? "Counts and records within the API's assigned-offering scope." : "Current system counts and stored workflow records."} />
    <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
      <StatCard label={user?.role === "TEACHER" ? "Students in assigned offerings" : "Students"} value={analytics?.studentCount ?? 0} icon={Users} />
      <StatCard label="Course offerings returned" value={data.offerings?.length ?? 0} icon={BookOpen} />
      <StatCard label="Stored prediction records" value={analytics?.predictionCount ?? 0} icon={GraduationCap} />
      <StatCard label="Open alerts in permitted scope" value={openAlerts} icon={Bell} />
    </section>
    <Card><CardHeader><CardTitle>Recent alerts</CardTitle><CardDescription>Persisted alerts visible to your role.</CardDescription></CardHeader><CardContent>
      {data.alerts?.length ? <ul className="divide-y divide-slate-100">{data.alerts.map((alert) => <li key={alert.id} className="py-3"><div className="flex flex-wrap justify-between gap-2"><p className="font-medium text-slate-900">{alert.student?.name ?? "Student"} · {alert.severity}</p><span className="text-xs text-slate-500">{alert.status} · {new Date(alert.createdAt).toLocaleDateString()}</span></div><p className="mt-1 text-sm text-slate-600">{alert.reason}</p></li>)}</ul> : <EmptyState title="No stored alerts" description="Alerts created by the academic system will appear here." />}
    </CardContent></Card>
    <p className="text-xs text-slate-500">No GPA, attendance-rate, trend, or risk-distribution metrics are available from the current analytics endpoint.</p>
  </div>;
}
