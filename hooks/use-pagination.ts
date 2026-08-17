"use client";

import { useMemo, useState } from "react";

interface UsePaginationResult<T> {
  page: number;
  pageCount: number;
  pagedItems: T[];
  setPage: (page: number) => void;
}

export function usePagination<T>(
  items: T[],
  pageSize: number,
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    pageCount,
    pagedItems,
    setPage,
  };
}
