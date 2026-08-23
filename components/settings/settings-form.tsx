"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/components/profile/profile-provider";
import { CURRENT_USER } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

export function SettingsForm() {
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [department, setDepartment] = useState(profile.department);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const syncProfileFields = () => {
      setName(profile.name);
      setRole(profile.role);
      setEmail(profile.email);
      setDepartment(profile.department);
    };
    queueMicrotask(syncProfileFields);
  }, [profile.name, profile.role, profile.email, profile.department]);
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
          <Input id="profile-name" label="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input id="profile-role" label="Role / title" value={role} onChange={(event) => setRole(event.target.value)} />
          <Input id="profile-email" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input
            id="profile-department"
            label="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
          <div className="md:col-span-2">
            <p className="mb-1.5 text-sm font-medium text-slate-700">Profile image</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-blue-50">
                {profile.image ? (
                  <img src={profile.image} alt="Profile preview" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => updateProfile({ image: String(reader.result) });
                  reader.readAsDataURL(file);
                }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Choose file
              </Button>
              {!profile.image ? <span className="text-sm text-slate-600">No file chosen</span> : null}
              {profile.image ? (
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  updateProfile({ image: "" });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}>
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              updateProfile({
                name: name.trim() || CURRENT_USER.name,
                role: role.trim() || CURRENT_USER.role,
                email: email.trim() || CURRENT_USER.email,
                department: department.trim() || CURRENT_USER.department,
              });
              setProfileSaved(true);
            }}
          >
            Save profile
          </Button>
          {profileSaved ? <p className="text-sm text-success">Profile saved in this browser.</p> : null}
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
