import type { ContributingFactor, RiskLevel } from "./common";

export interface Prediction {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  predictedPerformance: string;
  riskLevel: RiskLevel;
  confidence: number;
  contributingFactors: ContributingFactor[];
  date: string;
}

export interface PredictionOverview {
  totalPredictions: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  demoAccuracyNote: string;
}
