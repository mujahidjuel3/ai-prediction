import { alerts, analytics, courses, dashboardOverview, predictions, students } from "@/lib/mock-data";
import type { Alert, AlertSummary } from "@/types/alert";
import type { AnalyticsData } from "@/types/analytics";
import type { CourseDetail } from "@/types/course";
import type { Prediction, PredictionOverview } from "@/types/prediction";
import type { Student } from "@/types/student";

export async function getStudents(): Promise<Student[]> {
  return students;
}

export async function getStudentById(id: string): Promise<Student | null> {
  return students.find((student) => student.id === id) ?? null;
}

export async function getPredictions(): Promise<Prediction[]> {
  return predictions;
}

export async function getPredictionOverview(): Promise<PredictionOverview> {
  return {
    totalPredictions: predictions.length,
    highRisk: predictions.filter((item) => item.riskLevel === "high").length,
    mediumRisk: predictions.filter((item) => item.riskLevel === "medium").length,
    lowRisk: predictions.filter((item) => item.riskLevel === "low").length,
    demoAccuracyNote:
      "Accuracy figures are demonstration placeholders and are not produced by a trained model.",
  };
}

export async function getAlerts(): Promise<Alert[]> {
  return alerts;
}

export async function getAlertsByStudent(studentId: string): Promise<Alert[]> {
  return alerts.filter((alert) => alert.studentId === studentId);
}

export async function getAlertSummary(): Promise<AlertSummary> {
  return {
    total: alerts.length,
    highPriority: alerts.filter((alert) => alert.severity === "high").length,
    mediumPriority: alerts.filter((alert) => alert.severity === "medium").length,
    resolved: alerts.filter((alert) => alert.status === "resolved").length,
  };
}

export async function getCourses(): Promise<CourseDetail[]> {
  return courses;
}

export async function getCourseById(id: string): Promise<CourseDetail | null> {
  return courses.find((course) => course.id === id) ?? null;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return analytics;
}

export async function getDashboardData() {
  const highRiskStudents = students
    .filter((student) => student.riskLevel === "high" || student.riskLevel === "medium")
    .sort((a, b) => a.gpa - b.gpa);

  return {
    ...dashboardOverview,
    studentsRequiringAttention: highRiskStudents,
    recentAlerts: alerts.slice(0, 5),
    performanceTrend: analytics.performanceTrend,
    riskDistribution: analytics.riskDistribution,
  };
}
