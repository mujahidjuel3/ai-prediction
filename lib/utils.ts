export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatGpa(value: number): string {
  return value.toFixed(2);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function riskLabel(level: "low" | "medium" | "high"): string {
  if (level === "high") return "High Risk";
  if (level === "medium") return "Medium Risk";
  return "Low Risk";
}

export function severityLabel(level: "low" | "medium" | "high"): string {
  if (level === "high") return "High";
  if (level === "medium") return "Medium";
  return "Low";
}

export function factorLabel(level: "low" | "moderate" | "good"): string {
  if (level === "good") return "Good";
  if (level === "moderate") return "Moderate";
  return "Low";
}

export function alertTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    attendance: "Attendance",
    assessment: "Assessment",
    gpa: "GPA",
    assignment: "Assignment",
    engagement: "Engagement",
  };
  return labels[type] ?? type;
}

export function statusLabel(status: string): string {
  if (status === "acknowledged") return "Acknowledged";
  if (status === "resolved") return "Resolved";
  return "Open";
}
