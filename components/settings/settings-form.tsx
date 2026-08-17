"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CURRENT_USER } from "@/lib/constants";
import { useState } from "react";

export function SettingsForm() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Advisor profile used in this demonstration interface.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="profile-name" label="Name" defaultValue={CURRENT_USER.name} readOnly />
          <Input id="profile-role" label="Role" defaultValue={CURRENT_USER.role} readOnly />
          <Input id="profile-email" label="Email" defaultValue={CURRENT_USER.email} readOnly />
          <Input
            id="profile-department"
            label="Department"
            defaultValue={CURRENT_USER.department}
            readOnly
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>
            These options are stored in the browser for this demo only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="email-alerts"
            label="Email alerts"
            description="Receive a message when a high-risk alert is created."
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <ToggleRow
            id="weekly-digest"
            label="Weekly digest"
            description="Summary of risk movement sent at the end of each week."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
          <ToggleRow
            id="high-risk-only"
            label="High-risk alerts only"
            description="Hide low and medium severity notifications."
            checked={highRiskOnly}
            onChange={setHighRiskOnly}
          />
          <Button
            size="sm"
            onClick={() => {
              setSaved(true);
            }}
          >
            Save preferences
          </Button>
          {saved ? (
            <p className="text-sm text-success">Preferences saved in this session.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Dark mode will be added in a later release.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-3">
            <span>
              <span className="block text-sm font-medium text-slate-900">Dark mode</span>
              <span className="block text-sm text-slate-500">Coming soon</span>
            </span>
            <input type="checkbox" disabled className="h-4 w-4" aria-label="Dark mode, coming soon" />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System preferences</CardTitle>
          <CardDescription>Institution defaults for this demonstration build.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="gpa-threshold" label="High-risk GPA threshold" defaultValue="2.20" readOnly />
          <Input
            id="attendance-threshold"
            label="Attendance warning threshold"
            defaultValue="60%"
            readOnly
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-slate-200 px-3 py-3"
    >
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="block text-sm text-slate-500">{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-primary"
      />
    </label>
  );
}
