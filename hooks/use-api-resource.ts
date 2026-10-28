"use client";

import { apiData, formatApiError, getErrorStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useApiResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();

  const reload = useCallback(() => { setLoading(true); setError(null); setAttempt((value) => value + 1); }, []);

  useEffect(() => {
    let alive = true;
    apiData<T>(path).then((value) => { if (alive) setData(value); }).catch((reason: unknown) => {
      if (!alive) return;
      if (getErrorStatus(reason) === 401) {
        router.replace("/login?reason=session-expired");
        return;
      }
      setError(formatApiError(reason));
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, attempt, router]);

  return { data, loading, error, reload, setData };
}
