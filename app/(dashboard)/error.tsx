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
      description="Refresh the page or try again. Mock academic data should load without a backend."
      onRetry={reset}
    />
  );
}
