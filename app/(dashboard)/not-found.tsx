import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The record or route you requested is not available in this demonstration."
      action={
        <Link href="/dashboard" className={buttonClassName("primary", "sm")}>
          Back to dashboard
        </Link>
      }
    />
  );
}
