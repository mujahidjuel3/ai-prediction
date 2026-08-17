"use client";

import type { DepartmentComparison } from "@/types/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DepartmentComparisonChartProps {
  data: DepartmentComparison[];
}

export function DepartmentComparisonChart({
  data,
}: DepartmentComparisonChartProps) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend />
          <Bar dataKey="averageGpa" name="Average GPA" fill="#2563EB" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="highRiskCount"
            name="High-risk students"
            fill="#DC2626"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
