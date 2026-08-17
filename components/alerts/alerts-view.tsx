"use client";

import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { StudentIdentity } from "@/components/students/student-identity";
import { SeverityBadge, StatusBadge } from "@/components/ui/status-badges";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { alertTypeLabel, formatDate } from "@/lib/utils";
import type { Alert } from "@/types/alert";
import type { AlertSeverity, AlertStatus } from "@/types/common";
import Link from "next/link";
import { useMemo, useState } from "react";

interface AlertsViewProps {
  alerts: Alert[];
}

export function AlertsView({ alerts }: AlertsViewProps) {
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSeverity = severity === "all" || alert.severity === severity;
      const matchesStatus = status === "all" || alert.status === status;
      return matchesSeverity && matchesStatus;
    });
  }, [alerts, severity, status]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Select
            id="severity-filter"
            label="Severity"
            value={severity}
            onChange={(event) =>
              setSeverity(event.target.value as AlertSeverity | "all")
            }
            options={[
              { label: "All severities", value: "all" },
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
          />
          <Select
            id="status-filter"
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AlertStatus | "all")
            }
            options={[
              { label: "All statuses", value: "all" },
              { label: "Open", value: "open" },
              { label: "Acknowledged", value: "acknowledged" },
              { label: "Resolved", value: "resolved" },
            ]}
          />
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title="No alerts in this view"
            description="Try a different severity or status filter."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <THead>
                  <TR>
                    <TH>Student</TH>
                    <TH>Alert type</TH>
                    <TH>Severity</TH>
                    <TH>Reason</TH>
                    <TH>Date</TH>
                    <TH>Status</TH>
                    <TH>Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((alert) => (
                    <TR key={alert.id}>
                      <TD>
                        <StudentIdentity
                          name={alert.studentName}
                          secondary={alert.studentId}
                        />
                      </TD>
                      <TD>{alertTypeLabel(alert.type)}</TD>
                      <TD>
                        <SeverityBadge level={alert.severity} />
                      </TD>
                      <TD className="max-w-sm whitespace-normal">
                        {alert.reason}
                      </TD>
                      <TD>{formatDate(alert.date)}</TD>
                      <TD>
                        <StatusBadge status={alert.status} />
                      </TD>
                      <TD>
                        <Link
                          href={`/students/${alert.studentId}`}
                          className={buttonClassName("outline", "sm")}
                        >
                          Review
                        </Link>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <StudentIdentity
                      name={alert.studentName}
                      secondary={alertTypeLabel(alert.type)}
                    />
                    <SeverityBadge level={alert.severity} />
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{alert.reason}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={alert.status} />
                    <span className="text-xs text-slate-400">
                      {formatDate(alert.date)}
                    </span>
                  </div>
                  <Link
                    href={`/students/${alert.studentId}`}
                    className={`${buttonClassName("outline", "sm")} mt-3 w-full`}
                  >
                    Review student
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
