import type { ContributingFactor, MonthlyMetric, RiskLevel } from "./common";

export interface StudentCoursePerformance {
  courseId: string;
  courseCode: string;
  courseName: string;
  score: number;
  attendance: number;
  riskLevel: RiskLevel;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  gpa: number;
  attendance: number;
  assignmentAverage: number;
  quizAverage: number;
  midtermScore: number;
  riskLevel: RiskLevel;
  lastUpdated: string;
  predictedPerformance: string;
  predictionConfidence: number;
  contributingFactors: ContributingFactor[];
  recommendation: string;
  performanceTrend: MonthlyMetric[];
  courses: StudentCoursePerformance[];
}
