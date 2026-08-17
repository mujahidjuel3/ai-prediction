export type RiskLevel = "low" | "medium" | "high";

export type AlertSeverity = "low" | "medium" | "high";

export type AlertStatus = "open" | "acknowledged" | "resolved";

export type FactorLevel = "low" | "moderate" | "good";

export interface MonthlyMetric {
  month: string;
  gpa: number;
  attendance: number;
  assessment: number;
}

export interface ContributingFactor {
  name: string;
  level: FactorLevel;
}

export interface TrendIndicator {
  direction: "up" | "down" | "flat";
  value: string;
  sentiment: "positive" | "negative" | "neutral";
}
