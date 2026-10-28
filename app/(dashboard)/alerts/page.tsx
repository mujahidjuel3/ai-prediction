import { AlertsView } from "@/components/alerts/alerts-view";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return <div className="space-y-6"><PageHeader title="Early warning alerts" description="Persisted alert records visible to Admins and Teachers. No automatic risk policy is inferred here." /><AlertsView /></div>;
}
