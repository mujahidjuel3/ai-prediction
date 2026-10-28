import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Users,
  BellRing,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<"ADMIN" | "TEACHER" | "STUDENT">;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { href: "/students", label: "Students", icon: Users, roles: ["ADMIN", "TEACHER"] },
  { href: "/predictions", label: "Predictions", icon: Sparkles, roles: ["ADMIN", "TEACHER"] },
  { href: "/alerts", label: "Alerts", icon: Bell, roles: ["ADMIN", "TEACHER"] },
  { href: "/analytics", label: "Analytics", icon: LineChart, roles: ["ADMIN", "TEACHER"] },
  { href: "/courses", label: "Courses", icon: BookOpen, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { href: "/notifications", label: "Notifications", icon: BellRing, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "TEACHER", "STUDENT"] },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/predictions": "Predictions",
  "/alerts": "Alerts",
  "/analytics": "Analytics",
  "/courses": "Courses",
  "/settings": "Settings",
  "/notifications": "Notifications",
};
