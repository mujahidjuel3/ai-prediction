import type { AlertSeverity, AlertStatus } from "./common";

export type AlertType =
  | "attendance"
  | "assessment"
  | "gpa"
  | "assignment"
  | "engagement";

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: AlertType;
  severity: AlertSeverity;
  reason: string;
  date: string;
  status: AlertStatus;
}

export interface AlertSummary {
  total: number;
  highPriority: number;
  mediumPriority: number;
  resolved: number;
}
