import { LiveDashboard } from "@/components/dashboard/live-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() { return <LiveDashboard />; }
