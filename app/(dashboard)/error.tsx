"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="This section could not be loaded"
      description="Check your connection and signed-in permissions, then try the API request again."
      onRetry={reset}
    />
  );
}
