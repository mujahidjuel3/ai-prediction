import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getAlertSummary } from "@/lib/api";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const summary = await getAlertSummary();
  const unread = summary.total - summary.resolved;

  return <DashboardShell alertCount={unread}>{children}</DashboardShell>;
}
