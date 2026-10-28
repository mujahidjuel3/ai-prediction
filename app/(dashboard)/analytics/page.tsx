"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApiResource } from "@/hooks/use-api-resource";
import type { AnalyticsSummary } from "@/lib/api";
import { Bell, GraduationCap, Users } from "lucide-react";

export default function AnalyticsPage() {
  const { data, loading, error, reload } = useApiResource<AnalyticsSummary>("/analytics/summary");
  if (loading) return <LoadingState label="Loading persisted analytics summary" />;
  if (error) return <ErrorState title="Analytics are unavailable" description={error} onRetry={reload} />;
  if (!data) return <EmptyState title="No analytics response" description="The API returned no analytics summary." />;
  return <div className="space-y-6">
    <PageHeader title="Academic analytics" description="The current API exposes scoped record counts and alert groupings only." />
    <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-3"><StatCard label="Students in permitted scope" value={data.studentCount} icon={Users} /><StatCard label="Stored prediction records" value={data.predictionCount} icon={GraduationCap} /><StatCard label="Alert groups returned" value={data.alertsBySeverityAndStatus.length} icon={Bell} /></section>
    <Card><CardHeader><CardTitle>Stored alert counts</CardTitle><CardDescription>Grouped by persisted severity and status; these are counts, not computed risk estimates.</CardDescription></CardHeader><CardContent>{data.alertsBySeverityAndStatus.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-500"><tr><th className="py-2">Severity</th><th>Status</th><th>Records</th></tr></thead><tbody>{data.alertsBySeverityAndStatus.map((group) => <tr key={`${group.severity}-${group.status}`} className="border-t border-slate-100"><td className="py-3">{group.severity}</td><td>{group.status}</td><td>{group._count}</td></tr>)}</tbody></table></div> : <EmptyState title="No alert groups" description="No persisted alerts were returned for your permitted scope." />}</CardContent></Card>
    <p className="text-sm text-slate-600">The backend does not currently provide GPA trends, attendance aggregates, course performance comparisons, or risk-band policy analytics. No such figures are calculated or inferred by this page.</p>
  </div>;
}
