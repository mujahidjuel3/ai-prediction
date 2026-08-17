"use client";

import { NAV_ITEMS } from "@/lib/nav";
import { APP_NAME, APP_TAGLINE, CURRENT_USER } from "@/lib/constants";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { GraduationCap, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 lg:hidden",
          open ? "block" : "hidden",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Primary"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-slate-900">
                {APP_NAME}
              </span>
              <span className="block text-[11px] text-slate-500">{APP_TAGLINE}</span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Menu
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-blue-50 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={CURRENT_USER.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {CURRENT_USER.name}
              </p>
              <p className="truncate text-xs text-slate-500">{CURRENT_USER.role}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
