import { EmptyState } from "@/components/ui/empty-state";
import { buttonClassName } from "@/components/ui/button";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist."
        action={
          <Link href="/dashboard" className={buttonClassName("primary", "sm")}>
            Go to dashboard
          </Link>
        }
      />
    </div>
  );
}
