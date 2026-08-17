export const APP_NAME = "Academic Sentinel";
export const APP_TAGLINE = "Early Warning System";

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical & Electronic Engineering",
  "Business Administration",
  "Civil Engineering",
  "English",
  "Mathematics",
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const RISK_LEVELS = ["low", "medium", "high"] as const;

export const CURRENT_USER = {
  name: "Dr. Ayesha Rahman",
  role: "Academic Advisor",
  email: "ayesha.rahman@university.edu",
  department: "Computer Science & Engineering",
};

export const PAGE_SIZE = 8;
