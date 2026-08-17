import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/predictions", label: "Predictions", icon: Sparkles },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/predictions": "Predictions",
  "/alerts": "Alerts",
  "/analytics": "Analytics",
  "/courses": "Courses",
  "/settings": "Settings",
};
