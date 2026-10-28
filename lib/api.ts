export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface ApiEnvelope<T> {
  data: T;
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly kind: "http" | "network" | "configuration" = "http",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
}

export interface Department {
  id: string;
  code: string;
  name: string;
}

export interface AcademicTerm {
  id: string;
  code: string;
  label: string;
  academicYear: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface CourseOffering {
  id: string;
  section: string;
  course: { id: string; code: string; name: string; department: Department };
  term: AcademicTerm;
  teacher: { id: string; name: string } | null;
  _count?: { enrollments: number };
}

export interface StudentEnrollment {
  id: string;
  status: "ENROLLED" | "WITHDRAWN" | "COMPLETED";
  offering: CourseOffering;
}

export interface StudentProfile {
  id: string;
  studentNumber: string;
  name: string;
  email: string | null;
  enrollmentYear: number;
  status: "ACTIVE" | "INACTIVE";
  department: Department;
  departmentId: string;
  enrollments: StudentEnrollment[];
  summaries?: AcademicSummary[];
  predictions?: StoredPrediction[];
  alerts?: RiskAlert[];
}

export interface StudentListItem extends Omit<StudentProfile, "department" | "enrollments"> {
  department: Department;
}

export interface AcademicSummary {
  id: string;
  termId: string;
  gpa: number | string | null;
  attendancePercent: number | string | null;
  assessmentAverage: number | string | null;
  calculatedAt: string;
  calculationVersion: string;
  term?: AcademicTerm;
}

export interface AttendanceRecord {
  id: string;
  sessionDate: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  offering: CourseOffering;
}

export interface AssessmentScore {
  id: string;
  score: number | string | null;
  updatedAt: string;
  assessment: {
    id: string;
    name: string;
    kind: string;
    maxScore: number | string;
    offering: CourseOffering;
  };
}

export interface StudentRecords {
  attendance: AttendanceRecord[];
  scores: AssessmentScore[];
}

export interface StoredPrediction {
  id: string;
  studentId: string;
  termId: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  probability: number | string | null;
  generatedAt: string;
  term?: Pick<AcademicTerm, "code" | "label">;
  modelVersion?: { version: string; targetDefinition: string; metrics: unknown };
  reviews?: Array<{ id: string; outcome: string; rationale: string | null; createdAt: string }>;
}

export interface RiskAlert {
  id: string;
  studentId: string;
  termId: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
  recommendation: string | null;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  createdAt: string;
  resolvedAt: string | null;
  student?: { id: string; studentNumber: string; name: string };
  term?: { id: string; label: string };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface UserProfile extends SessionUser {
  createdAt: string;
  preference: NotificationPreferences | null;
}

export interface NotificationPreferences {
  userId: string;
  inApp: boolean;
  email: boolean;
  weeklySummary: boolean;
  categories: { highRiskAlerts?: boolean; attendanceAlerts?: boolean };
}

export interface DashboardSummary {
  students: number;
  departments: number;
  teachers: number;
  courses: number;
  offerings: number;
  openAlerts: number;
}

export interface AnalyticsSummary {
  studentCount: number;
  predictionCount: number;
  alertsBySeverityAndStatus: Array<{
    severity: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
    _count: number;
  }>;
}

function csrfCookie() {
  if (typeof document === "undefined") return undefined;
  const token = document.cookie.split("; ").find((part) => part.startsWith("csrf_token="))?.slice("csrf_token=".length);
  return token ? decodeURIComponent(token) : undefined;
}

async function ensureCsrf() {
  const existing = csrfCookie();
  if (existing) return existing;
  const url = apiUrl("/auth/csrf");
  let response: Response;
  try { response = await fetch(url, { credentials: "include", cache: "no-store" }); }
  catch { throw new ApiError("The API could not be reached. Check the connection and try again.", undefined, "network"); }
  if (!response.ok) throw new ApiError("Could not establish a secure request token.", response.status);
  const body = await response.json() as ApiEnvelope<{ csrfToken: string }>;
  return body.data.csrfToken;
}

async function rawRequest(path: string, init: RequestInit) {
  const url = apiUrl(path);
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("X-CSRF-Token", await ensureCsrf());
  try {
    return await fetch(url, { ...init, method, headers, credentials: "include", cache: "no-store" });
  } catch {
    throw new ApiError("The API could not be reached. Check the connection and try again.", undefined, "network");
  }
}

async function refreshSession() {
  let response = await rawRequest("/auth/refresh", { method: "POST" });
  if (response.status === 403 && await isCsrfFailure(response)) {
    await fetch(apiUrl("/auth/csrf"), { credentials: "include", cache: "no-store" });
    response = await rawRequest("/auth/refresh", { method: "POST" });
  }
  return response.ok;
}

async function isCsrfFailure(response: Response) {
  const body = await response.clone().json().catch(() => undefined) as { error?: { message?: unknown } } | undefined;
  return typeof body?.error?.message === "string" && /^(invalid csrf token|csrf token required)$/i.test(body.error.message);
}

async function readResponse<T>(response: Response): Promise<T> {
  let body: unknown;
  try { body = await response.json(); } catch { body = undefined; }
  if (!response.ok) {
    const payload = body as { message?: string | string[]; error?: { message?: string; details?: Array<{ message?: string }> } } | undefined;
    const baseMessage = Array.isArray(payload?.message)
      ? payload.message.join(" ")
      : payload?.message ?? payload?.error?.message ?? response.statusText ?? "The request failed.";
    const details = payload?.error?.details?.map((detail) => detail.message).filter((detail): detail is string => Boolean(detail)) ?? [];
    throw new ApiError(details.length ? `${baseMessage}: ${details.join("; ")}` : baseMessage, response.status);
  }
  return body as T;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> {
  let response = await rawRequest(path, init);
  if (response.status === 401 && path !== "/auth/refresh" && path !== "/auth/login") {
    try {
      if (await refreshSession()) response = await rawRequest(path, init);
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) throw error;
    }
  }
  if (response.status === 403 && !["GET", "HEAD", "OPTIONS"].includes((init.method ?? "GET").toUpperCase()) && await isCsrfFailure(response)) {
    await fetch(apiUrl("/auth/csrf"), { credentials: "include", cache: "no-store" }).catch(() => undefined);
    response = await rawRequest(path, init);
  }
  if (response.status === 401 && typeof window !== "undefined" && !["/auth/login", "/auth/csrf", "/auth/refresh"].includes(path)) {
    window.dispatchEvent(new Event("academic:session-expired"));
  }
  return readResponse<ApiEnvelope<T>>(response);
}

export function apiData<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, init).then((response) => response.data);
}

export function updateRequest(method: "PATCH" | "POST", data?: unknown): RequestInit {
  return { method, ...(data === undefined ? {} : { body: JSON.stringify(data) }) };
}

export function formatApiError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.kind === "configuration" || error.kind === "network") return error.message;
    if (error.status === 401) return "Your session has expired. Sign in again to continue.";
    if (error.status === 403) return "You do not have permission to view or change this information.";
    if (error.status === 400 || error.status === 409 || error.status === 422) return error.message;
    if (error.status && error.status >= 500) return "The service is temporarily unavailable. Try again later.";
    return error.message;
  }
  return "An unexpected error occurred. Try again.";
}

export function getErrorStatus(error: unknown) {
  return error instanceof ApiError ? error.status : undefined;
}
import { apiUrl } from "@/lib/api-url";
