import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { FactorBadge, RiskBadge } from "@/components/ui/status-badges";
import { StudentIdentity } from "@/components/students/student-identity";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { buttonClassName } from "@/components/ui/button";
import { getPredictionOverview, getPredictions } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predictions",
};

export default async function PredictionsPage() {
  const [predictions, overview] = await Promise.all([
    getPredictions(),
    getPredictionOverview(),
  ]);

  const highRisk = predictions.filter((item) => item.riskLevel === "high");
  const riskDistribution = [
    { level: "low" as const, count: overview.lowRisk },
    { level: "medium" as const, count: overview.mediumRisk },
    { level: "high" as const, count: overview.highRisk },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Predictions"
        description="Demonstration predictions showing likely academic outcomes and contributing factors."
      />

      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Predictions generated"
          value={overview.totalPredictions}
          icon={Sparkles}
        />
        <StatCard
          label="High risk"
          value={overview.highRisk}
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Medium risk"
          value={overview.mediumRisk}
          icon={Gauge}
          tone="warning"
        />
        <StatCard
          label="Low risk"
          value={overview.lowRisk}
          icon={ShieldCheck}
          tone="success"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Risk distribution</CardTitle>
            <CardDescription>Predicted risk bands for the current cohort.</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={riskDistribution} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Prediction accuracy</CardTitle>
            <CardDescription>Placeholder metric for the future model service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold text-slate-900">
              81%
              <span className="ml-2 text-sm font-medium text-slate-400">demo</span>
            </p>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              {overview.demoAccuracyNote} When the Python prediction service is
              connected, this panel will show evaluated precision, recall, and
              calibration against historical outcomes.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>High-risk students</CardTitle>
          <CardDescription>
            Students whose current indicators suggest immediate academic follow-up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {highRisk.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-md border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <StudentIdentity name={item.studentName} secondary={item.department} />
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge level={item.riskLevel} />
                <Link
                  href={`/students/${item.studentId}`}
                  className={buttonClassName("outline", "sm")}
                >
                  Open profile
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Recent predictions</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {predictions.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-4 py-5">
                <div className="flex items-start justify-between gap-3">
                  <StudentIdentity
                    name={item.studentName}
                    secondary={item.department}
                  />
                  <RiskBadge level={item.riskLevel} />
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Predicted performance: </span>
                  {item.predictedPerformance}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Confidence: </span>
                  {item.confidence}%
                  <span className="ml-1 text-xs text-slate-400">(demo)</span>
                </p>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Contributing factors
                  </p>
                  <ul className="space-y-2">
                    {item.contributingFactors.map((factor) => (
                      <li
                        key={factor.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-700">{factor.name}</span>
                        <FactorBadge level={factor.level} />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
