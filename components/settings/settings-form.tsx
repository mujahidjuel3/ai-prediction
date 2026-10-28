"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { apiRequest, formatApiError, type UserProfile } from "@/lib/api";
import { useEffect, useState } from "react";

export function SettingsForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState({ inApp: true, email: false, weeklySummary: false, highRiskAlerts: true, attendanceAlerts: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let alive = true;
    apiRequest<UserProfile>("/users/me").then(({ data }) => {
      if (!alive) return;
      setProfile(data);
      const saved = data.preference;
      if (saved) setPreferences({ inApp: saved.inApp, email: saved.email, weeklySummary: saved.weeklySummary, highRiskAlerts: saved.categories?.highRiskAlerts ?? true, attendanceAlerts: saved.categories?.attendanceAlerts ?? true });
    }).catch((reason: unknown) => { if (alive) setError(formatApiError(reason)); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [retry]);

  async function savePreferences() {
    setSaving(true); setError(null); setMessage(null);
    try {
      await apiRequest("/users/me/preferences", { method: "PATCH", body: JSON.stringify(preferences) });
      setMessage("Notification preferences saved to your account.");
    } catch (reason) { setError(formatApiError(reason)); }
    finally { setSaving(false); }
  }

  if (loading) return <LoadingState label="Loading account settings" />;
  if (error && !profile) return <ErrorState title="Settings could not be loaded" description={error} onRetry={() => { setLoading(true); setError(null); setRetry((value) => value + 1); }} />;
  return <div className="space-y-6">
    {error ? <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <Card><CardHeader><CardTitle>Account</CardTitle><CardDescription>Identity returned for your authenticated session.</CardDescription></CardHeader><CardContent className="grid gap-3 text-sm sm:grid-cols-2"><p><span className="text-slate-500">Name: </span>{profile?.name}</p><p><span className="text-slate-500">Email: </span>{profile?.email}</p><p><span className="text-slate-500">Role: </span>{profile?.role}</p><p><span className="text-slate-500">Status: </span>{profile?.status}</p><p className="text-xs text-slate-500 sm:col-span-2">Academic identity fields are managed by the institution so account and academic profiles stay aligned.</p></CardContent></Card>
    <Card><CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>Email delivery is optional and applies only to eligible manual messages after institutional policy approval. SMTP acceptance is not proof of inbox delivery; risk-alert email is not enabled.</CardDescription></CardHeader><CardContent className="space-y-3">{[
      ["inApp", "In-app messages", "Allow in-app notification preference."],
      ["email", "Email opt-in", "Allows eligible manual messages to be emailed when server SMTP is configured."],
      ["weeklySummary", "Weekly summary preference", "Stores a preference only; no weekly email is sent."],
      ["highRiskAlerts", "High-risk alert category", "Preference category saved by the API."],
      ["attendanceAlerts", "Attendance alert category", "Preference category saved by the API."],
    ].map(([key, label, description]) => <label key={key} htmlFor={`pref-${key}`} className="flex items-start justify-between gap-4 rounded-md border border-slate-200 px-3 py-3"><span><span className="block text-sm font-medium text-slate-900">{label}</span><span className="block text-sm text-slate-500">{description}</span></span><input id={`pref-${key}`} type="checkbox" checked={preferences[key as keyof typeof preferences]} onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))} className="mt-1 h-4 w-4 accent-primary" /></label>)}
      <Button size="sm" disabled={saving} onClick={() => void savePreferences()}>{saving ? "Saving…" : "Save preferences"}</Button>{message ? <p role="status" className="text-sm text-green-700">{message}</p> : null}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Prediction availability</CardTitle><CardDescription>Prediction generation is disabled until an approved model and risk policy are configured.</CardDescription></CardHeader><CardContent><p className="text-sm text-slate-600">No GPA threshold, attendance threshold, or risk rule can be changed here because none is approved in the API contract.</p></CardContent></Card>
  </div>;
}
