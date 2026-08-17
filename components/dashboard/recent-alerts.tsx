import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SeverityBadge } from "@/components/ui/status-badges";
import { alertTypeLabel, formatDate } from "@/lib/utils";
import type { Alert } from "@/types/alert";
import { Bell } from "lucide-react";
import Link from "next/link";

export function RecentAlerts({ alerts }: { alerts: Alert[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Recent alerts</CardTitle>
          <Link href="/alerts" className="text-sm font-medium text-primary">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState
            title="No recent alerts"
            description="New early-warning alerts will appear here."
            icon={<Bell className="h-5 w-5" />}
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <li key={alert.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {alert.studentName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{alert.reason}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">{alertTypeLabel(alert.type)}</Badge>
                      <span className="text-xs text-slate-400">
                        {formatDate(alert.date)}
                      </span>
                    </div>
                  </div>
                  <SeverityBadge level={alert.severity} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
