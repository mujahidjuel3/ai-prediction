import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TrendIndicator } from "@/types/common";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: TrendIndicator;
  tone?: "default" | "danger" | "warning" | "success";
}

const toneClasses = {
  default: "bg-blue-50 text-primary",
  danger: "bg-red-50 text-danger",
  warning: "bg-amber-50 text-warning",
  success: "bg-emerald-50 text-success",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {trend ? <TrendRow trend={trend} /> : null}
    </div>
  );
}

function TrendRow({ trend }: { trend: TrendIndicator }) {
  const Icon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
        ? TrendingDown
        : Minus;

  const color =
    trend.sentiment === "positive"
      ? "text-success"
      : trend.sentiment === "negative"
        ? "text-danger"
        : "text-slate-500";

  return (
    <p className={cn("mt-3 flex items-center gap-1 text-xs", color)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>
        {trend.value} vs last term
      </span>
    </p>
  );
}
