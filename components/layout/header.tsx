"use client";

import { Avatar } from "@/components/ui/avatar";
import { useProfile } from "@/components/profile/profile-provider";
import { PAGE_TITLES } from "@/lib/nav";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
  alertCount: number;
}

export function Header({ onMenuClick, alertCount }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="app-sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <p className="hidden text-xs text-slate-500 sm:block">
            University academic analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/alerts"
          className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100"
          aria-label={`Notifications, ${alertCount} open alerts`}
        >
          <Bell className="h-5 w-5" />
          {alertCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          ) : null}
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Avatar name={profile.name} image={profile.image} size="sm" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-900">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/students/")) return "Student profile";
  if (pathname.startsWith("/courses/")) return "Course details";
  return PAGE_TITLES[pathname] ?? "Academic Sentinel";
}
