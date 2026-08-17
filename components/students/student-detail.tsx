import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceTrendChart } from "@/components/charts/performance-trend-chart";
import { Avatar } from "@/components/ui/avatar";
import { FactorBadge, RiskBadge, SeverityBadge } from "@/components/ui/status-badges";
import { alertTypeLabel, formatDate, formatGpa, formatPercent } from "@/lib/utils";
import type { Alert } from "@/types/alert";
import type { Student } from "@/types/student";
import { BookOpen, ClipboardCheck, GraduationCap, Percent, Sparkles } from "lucide-react";

interface StudentDetailProps {
  student: Student;
  alerts: Alert[];
}

export function StudentDetail({ student, alerts }: StudentDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} size="lg" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {student.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {student.studentId} · {student.department}
              </p>
              <p className="text-sm text-slate-500">{student.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge level={student.riskLevel} />
            <span className="text-sm text-slate-500">
              Semester {student.semester}
            </span>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-5">
        <SummaryTile
          label="Current GPA"
          value={formatGpa(student.gpa)}
          icon={GraduationCap}
        />
        <SummaryTile
          label="Attendance"
          value={formatPercent(student.attendance)}
          icon={Percent}
        />
        <SummaryTile
          label="Assignment average"
          value={formatPercent(student.assignmentAverage)}
          icon={ClipboardCheck}
        />
        <SummaryTile
          label="Quiz average"
          value={formatPercent(student.quizAverage)}
          icon={BookOpen}
        />
        <SummaryTile
          label="Midterm score"
          value={formatPercent(student.midtermScore)}
          icon={Sparkles}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Performance trend</CardTitle>
            <CardDescription>GPA movement over the last six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={student.performanceTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk assessment</CardTitle>
            <CardDescription>Current standing and contributing factors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Risk level</p>
              <div className="mt-2">
                <RiskBadge level={student.riskLevel} />
              </div>
            </div>
            <ul className="space-y-2">
              {student.contributingFactors.map((factor) => (
                <li
                  key={factor.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-700">{factor.name}</span>
                  <FactorBadge level={factor.level} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prediction summary</CardTitle>
            <CardDescription>
              Demonstration values generated from mock academic indicators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Predicted performance: </span>
              {student.predictedPerformance}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Confidence: </span>
              {student.predictionConfidence}%
              <span className="ml-1 text-xs text-slate-400">(demo)</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI recommendation</CardTitle>
            <CardDescription>
              Advisory text for academic staff. Not a live model output.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-700">
              {student.recommendation}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Course performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {student.courses.map((course) => (
            <div
              key={course.courseId}
              className="flex flex-col gap-2 rounded-md border border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{course.courseName}</p>
                <p className="text-xs text-slate-500">{course.courseCode}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>Score {formatPercent(course.score)}</span>
                <span>Attendance {formatPercent(course.attendance)}</span>
                <RiskBadge level={course.riskLevel} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500">No alerts for this student.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="text-sm text-slate-700">{alert.reason}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {alertTypeLabel(alert.type)} · {formatDate(alert.date)}
                    </p>
                  </div>
                  <SeverityBadge level={alert.severity} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof GraduationCap;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs">{label}</p>
      </div>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
