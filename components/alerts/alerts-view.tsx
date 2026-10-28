"use client";

import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { apiRequest, formatApiError, type RiskAlert } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AlertsView() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [status, setStatus] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (status !== "all") params.set("status", status);
    apiRequest<RiskAlert[]>(`/alerts?${params}`).then((response) => {
      if (!alive) return;
      setAlerts(response.data); setPageCount(response.meta?.totalPages ?? 1);
    }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [page, status, retry]);

  async function updateStatus(alert: RiskAlert, nextStatus: "ACKNOWLEDGED" | "RESOLVED") {
    setPending(alert.id); setActionError(null);
    try {
      await apiRequest(`/alerts/${encodeURIComponent(alert.id)}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      setRetry((value) => value + 1);
    } catch (reason) { setActionError(formatApiError(reason)); }
    finally { setPending(null); }
  }

  const visible = severity === "all" ? alerts : alerts.filter((alert) => alert.severity === severity);
  return <div className="space-y-4">
    <Card className="p-4"><div className="grid gap-3 sm:grid-cols-2"><Select id="alert-status" label="Status" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value); setPage(1); }} options={[{ label: "All statuses", value: "all" }, { label: "Open", value: "OPEN" }, { label: "Acknowledged", value: "ACKNOWLEDGED" }, { label: "Resolved", value: "RESOLVED" }]} /><Select id="alert-severity" label="Severity" value={severity} onChange={(event) => setSeverity(event.target.value)} options={[{ label: "All severities", value: "all" }, { label: "High", value: "HIGH" }, { label: "Medium", value: "MEDIUM" }, { label: "Low", value: "LOW" }]} /></div></Card>
    {actionError ? <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">Update failed: {actionError}</p> : null}
    {error ? <ErrorState title="Alerts could not be loaded" description={error} onRetry={() => setRetry((value) => value + 1)} /> : null}
    {loading ? <LoadingState label="Loading alerts in your permitted scope" /> : error ? null : <Card>
      {visible.length === 0 ? <EmptyState title="No stored alerts" description={severity === "all" ? "No alerts were returned for this status." : "No alerts match this severity on the current page."} /> : <Table><THead><TR><TH>Student</TH><TH>Category</TH><TH>Severity</TH><TH>Reason</TH><TH>Term</TH><TH>Status</TH><TH>Actions</TH></TR></THead><TBody>{visible.map((alert) => <TR key={alert.id}><TD>{alert.student ? <Link className="font-medium text-primary" href={`/students/${alert.student.id}`}>{alert.student.name}<span className="block text-xs text-slate-500">{alert.student.studentNumber}</span></Link> : "—"}</TD><TD>{alert.category}</TD><TD>{alert.severity}</TD><TD className="max-w-sm whitespace-normal">{alert.reason}</TD><TD>{alert.term?.label ?? "—"}</TD><TD>{alert.status}</TD><TD><div className="flex gap-2">{alert.status === "OPEN" ? <button className={buttonClassName("outline", "sm")} disabled={pending === alert.id} onClick={() => void updateStatus(alert, "ACKNOWLEDGED")}>Acknowledge</button> : null}{alert.status !== "RESOLVED" ? <button className={buttonClassName("primary", "sm")} disabled={pending === alert.id} onClick={() => void updateStatus(alert, "RESOLVED")}>Resolve</button> : null}</div></TD></TR>)}</TBody></Table>}
      <Pagination page={page} pageCount={pageCount} onPageChange={(nextPage) => { setLoading(true); setPage(nextPage); }} />
    </Card>}
  </div>;
}
