import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { DepartmentComparisonChart } from "@/components/charts/department-comparison-chart";
import { PerformanceTrendChart } from "@/components/charts/performance-trend-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { getAnalytics } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Analytics"
        description="Institution-level trends for GPA, attendance, risk, and course performance."
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Performance trend</CardTitle>
            <CardDescription>Average GPA across the last six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={data.performanceTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk distribution</CardTitle>
            <CardDescription>Share of students in each risk band.</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={data.riskDistribution} />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department comparison</CardTitle>
            <CardDescription>Average GPA and high-risk counts by faculty area.</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentComparisonChart data={data.departmentComparison} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GPA distribution</CardTitle>
            <CardDescription>How the current cohort is spread across GPA bands.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={data.gpaDistribution}
              xKey="range"
              yKey="count"
              color="#2563EB"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance analysis</CardTitle>
            <CardDescription>Student counts by attendance range.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={data.attendanceAnalysis}
              xKey="range"
              yKey="count"
              color="#16A34A"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course performance</CardTitle>
            <CardDescription>Average score by course code.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={data.coursePerformance}
              xKey="courseCode"
              yKey="averageScore"
              color="#D97706"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
