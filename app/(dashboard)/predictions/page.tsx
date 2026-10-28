"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { useApiResource } from "@/hooks/use-api-resource";
import type { StoredPrediction } from "@/lib/api";

export default function PredictionsPage() {
  const { data, loading, error, reload } = useApiResource<StoredPrediction[]>("/predictions?page=1&pageSize=50");
  if (loading) return <LoadingState label="Loading stored prediction history" />;
  if (error) return <ErrorState title="Prediction history is unavailable" description={error} onRetry={reload} />;
  return <div className="space-y-6"><PageHeader title="Prediction history" description="Stored outputs returned by the API. This frontend does not generate predictions." />
    {!data?.length ? <Card><EmptyState title="No prediction history available" description="No stored predictions were returned. Generation is unavailable until an approved trained model and risk policy are configured." /></Card> : <div className="space-y-3">{data.map((prediction) => <Card key={prediction.id}><CardHeader><CardTitle>{prediction.studentId} · {prediction.term?.label ?? prediction.termId}</CardTitle><CardDescription>Generated {new Date(prediction.generatedAt).toLocaleString()}</CardDescription></CardHeader><CardContent className="grid gap-2 text-sm sm:grid-cols-2"><p>Stored model risk output: <strong>{prediction.riskLevel}</strong></p><p>Stored probability: {prediction.probability ?? "Not recorded"}</p><p>Model version: {prediction.modelVersion?.version ?? "Unavailable"}</p><p>Target definition: {prediction.modelVersion?.targetDefinition ?? "Unavailable"}</p></CardContent></Card>)}</div>}
  </div>;
}
