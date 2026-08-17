"use client";

import { riskLabel } from "@/lib/utils";
import type { RiskDistributionPoint } from "@/types/analytics";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS: Record<string, string> = {
  low: "#16A34A",
  medium: "#D97706",
  high: "#DC2626",
};

interface RiskDistributionChartProps {
  data: RiskDistributionPoint[];
}

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    name: riskLabel(item.level),
  }));

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.level} fill={COLORS[entry.level]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
