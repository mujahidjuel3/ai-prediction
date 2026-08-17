"use client";

import type { MonthlyMetric } from "@/types/common";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceOverviewChartProps {
  data: MonthlyMetric[];
}

export function PerformanceOverviewChart({
  data,
}: PerformanceOverviewChartProps) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#64748b", fontSize: 12 }}
            domain={[0, 4]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#64748b", fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="gpa"
            name="Average GPA"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="attendance"
            name="Average attendance"
            stroke="#16A34A"
            strokeWidth={2}
            dot={false}
            yAxisId="right"
          />
          <Line
            type="monotone"
            dataKey="assessment"
            name="Average assessment"
            stroke="#D97706"
            strokeWidth={2}
            dot={false}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
