"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApiResource } from "@/hooks/use-api-resource";
import type { StoredPrediction } from "@/lib/api";

function isSynthetic(prediction: StoredPrediction): boolean {
  const metrics = prediction.modelVersion?.metrics as { isSynthetic?: boolean } | null | undefined;
  return Boolean(
    prediction.explanation?.isSynthetic
    || prediction.featureSnapshot?.isSynthetic
    || metrics?.isSynthetic
    || prediction.explanation?.label?.includes("SYNTHETIC")
    || prediction.featureSnapshot?.demoLabel?.includes("SYNTHETIC"),
  );
}

export default function PredictionsPage() {
  const { data, loading, error, reload } = useApiResource<StoredPrediction[]>("/predictions?page=1&pageSize=50");
  if (loading) return <LoadingState label="Loading stored prediction history" />;
  if (error) return <ErrorState title="Prediction history is unavailable" description={error} onRetry={reload} />;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prediction history"
        description="Stored outputs returned by the API. This frontend does not generate predictions. Synthetic rows are labeled DEMO / SYNTHETIC."
      />
      {!data?.length ? (
        <Card>
          <EmptyState
            title="No prediction history available"
            description="No stored predictions were returned. Generation is unavailable until an approved trained model and risk policy are configured, or an administrator runs a labeled demo workflow."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((prediction) => {
            const synthetic = isSynthetic(prediction);
            const indicators = prediction.explanation?.contributingIndicators ?? prediction.featureSnapshot;
            return (
              <Card key={prediction.id}>
                <CardHeader>
                  <CardTitle>
                    {prediction.student?.name ?? prediction.studentId} · {prediction.term?.label ?? prediction.termId}
                  </CardTitle>
                  <CardDescription>Generated {new Date(prediction.generatedAt).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                  {synthetic ? (
                    <p className="sm:col-span-2">
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900">
                        DEMO / SYNTHETIC
                      </span>
                      <span className="ml-2 text-slate-600">Not an institutionally validated student risk prediction.</span>
                    </p>
                  ) : null}
                  <p>
                    Stored model risk output: <strong>{prediction.riskLevel}</strong>
                  </p>
                  <p>Stored probability: {prediction.probability ?? "Not recorded"}</p>
                  <p>Model version: {prediction.modelVersion?.version ?? "Unavailable"}</p>
                  <p>Target definition: {prediction.modelVersion?.targetDefinition ?? "Unavailable"}</p>
                  {indicators ? (
                    <p className="sm:col-span-2 text-slate-600">
                      Indicators: attendance {(indicators as { attendance?: number }).attendance ?? "—"} · quiz{" "}
                      {(indicators as { quiz_avg?: number }).quiz_avg ?? "—"} · midterm{" "}
                      {(indicators as { midterm?: number }).midterm ?? "—"} · assignment{" "}
                      {(indicators as { assignment_avg?: number }).assignment_avg ?? "—"} · CGPA{" "}
                      {(indicators as { prior_gpa?: number }).prior_gpa ?? "—"}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
