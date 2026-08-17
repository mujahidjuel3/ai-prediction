import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceOverviewChart } from "@/components/charts/performance-overview-chart";
import { PerformanceTrendChart } from "@/components/charts/performance-trend-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { AttentionTable } from "@/components/dashboard/attention-table";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { getDashboardData } from "@/lib/api";
import { AlertTriangle, ShieldCheck, UserRound, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Performance Overview"
        description="Monitor student performance and identify academic risks early."
      />

      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={data.kpis.totalStudents}
          icon={Users}
          trend={data.kpiTrends.totalStudents}
        />
        <StatCard
          label="High risk students"
          value={data.kpis.highRisk}
          icon={AlertTriangle}
          tone="danger"
          trend={data.kpiTrends.highRisk}
        />
        <StatCard
          label="Medium risk students"
          value={data.kpis.mediumRisk}
          icon={UserRound}
          tone="warning"
          trend={data.kpiTrends.mediumRisk}
        />
        <StatCard
          label="Low risk students"
          value={data.kpis.lowRisk}
          icon={ShieldCheck}
          tone="success"
          trend={data.kpiTrends.lowRisk}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Performance overview</CardTitle>
            <CardDescription>
              Average GPA, attendance, and assessment score across the current term.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceOverviewChart data={data.performanceTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk distribution</CardTitle>
            <CardDescription>Current academic risk bands.</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={data.riskDistribution} />
          </CardContent>
        </Card>
      </section>

      <AttentionTable students={data.studentsRequiringAttention} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance trend</CardTitle>
              <CardDescription>
                Institutional average GPA over the last six months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceTrendChart data={data.performanceTrend} />
            </CardContent>
          </Card>
        </div>
        <RecentAlerts alerts={data.recentAlerts} />
      </section>
    </div>
  );
}
