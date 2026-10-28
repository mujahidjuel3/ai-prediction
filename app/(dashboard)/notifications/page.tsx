"use client";

import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/ui/page-header";
import { apiRequest, formatApiError, type NotificationItem } from "@/lib/api";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    apiRequest<NotificationItem[]>(`/notifications?page=${page}&pageSize=25`).then((result) => {
      if (!alive) return;
      setItems(result.data); setPageCount(result.meta?.totalPages ?? 1);
    }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [page, retry]);

  async function markRead(id: string) {
    setActionError(null);
    try { await apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }); setRetry((value) => value + 1); }
    catch (reason) { setActionError(formatApiError(reason)); }
  }
  async function markAllRead() {
    setActionError(null);
    try { await apiRequest("/notifications/read-all", { method: "POST" }); setRetry((value) => value + 1); }
    catch (reason) { setActionError(formatApiError(reason)); }
  }

  return <div className="space-y-6"><PageHeader title="Notifications" description="Persisted in-app messages for your signed-in account." />
    {items.some((item) => !item.readAt) ? <button className={buttonClassName("outline", "sm")} onClick={() => void markAllRead()}>Mark all as read</button> : null}
    {actionError ? <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{actionError}</p> : null}
    {error ? <ErrorState title="Notifications could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} /> : null}
    {loading ? <LoadingState label="Loading your notifications" /> : error ? null : <Card className="divide-y divide-slate-100 px-4">{items.length ? items.map((item) => <article key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-medium text-slate-900">{item.title}{!item.readAt ? <span className="ml-2 rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">Unread</span> : null}</h2><p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{item.message}</p><p className="mt-2 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>{!item.readAt ? <button className={buttonClassName("outline", "sm")} onClick={() => void markRead(item.id)}>Mark read</button> : null}</article>) : <EmptyState title="No messages yet" description="Messages addressed to this account will appear here." />}<Pagination page={page} pageCount={pageCount} onPageChange={(nextPage) => { setLoading(true); setPage(nextPage); }} /></Card>}
  </div>;
}
