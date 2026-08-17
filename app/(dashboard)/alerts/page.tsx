import { AlertsView } from "@/components/alerts/alerts-view";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { getAlertSummary, getAlerts } from "@/lib/api";
import { Bell, CircleCheck, ShieldAlert, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alerts",
};

export default async function AlertsPage() {
  const [alerts, summary] = await Promise.all([getAlerts(), getAlertSummary()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Early Warning Alerts"
        description="Track attendance, assessment, and engagement alerts that require academic follow-up."
      />
      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total alerts" value={summary.total} icon={Bell} />
        <StatCard
          label="High priority"
          value={summary.highPriority}
          icon={ShieldAlert}
          tone="danger"
        />
        <StatCard
          label="Medium priority"
          value={summary.mediumPriority}
          icon={TriangleAlert}
          tone="warning"
        />
        <StatCard
          label="Resolved"
          value={summary.resolved}
          icon={CircleCheck}
          tone="success"
        />
      </section>
      <AlertsView alerts={alerts} />
    </div>
  );
}
