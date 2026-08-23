"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ProfileProvider } from "@/components/profile/profile-provider";
import { useState, type ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  alertCount: number;
}

export function DashboardShell({ children, alertCount }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="lg:pl-64">
          <Header onMenuClick={() => setOpen(true)} alertCount={alertCount} />
          <main className="px-4 py-5 xs:px-5 md:px-6 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-[1440px]">{children}</div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
