import type { MonthlyMetric, RiskLevel } from "./common";

export interface DepartmentComparison {
  department: string;
  averageGpa: number;
  averageAttendance: number;
  highRiskCount: number;
}

export interface GpaBucket {
  range: string;
  count: number;
}

export interface AttendanceBucket {
  range: string;
  count: number;
}

export interface CoursePerformancePoint {
  courseCode: string;
  averageScore: number;
  riskPercentage: number;
}

export interface RiskDistributionPoint {
  level: RiskLevel;
  count: number;
}

export interface AnalyticsData {
  performanceTrend: MonthlyMetric[];
  riskDistribution: RiskDistributionPoint[];
  departmentComparison: DepartmentComparison[];
  attendanceAnalysis: AttendanceBucket[];
  gpaDistribution: GpaBucket[];
  coursePerformance: CoursePerformancePoint[];
}

export interface DashboardKpis {
  totalStudents: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}
