"use client";

import { Avatar } from "@/components/ui/avatar";
import { PAGE_TITLES } from "@/lib/nav";
import type { SessionUser } from "@/lib/api";
import { Bell, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
  alertCount: number;
  user: SessionUser;
  onSignOut: () => void;
}

export function Header({ onMenuClick, alertCount, user, onSignOut }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} aria-label="Open navigation" aria-controls="app-sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{getPageTitle(pathname)}</p>
          <p className="hidden text-xs text-slate-500 sm:block">University academic services</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/notifications" className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label={`Notifications, ${alertCount} unread`}>
          <Bell className="h-5 w-5" />
          {alertCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /> : null}
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Avatar name={user.name} size="sm" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
        <button type="button" aria-label="Sign out" title="Sign out" className="rounded-md p-2 text-slate-600 hover:bg-slate-100" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/students/")) return "Student profile";
  if (pathname.startsWith("/courses/")) return "Course details";
  return PAGE_TITLES[pathname] ?? "Academic Sentinel";
}
