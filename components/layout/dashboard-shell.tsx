"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { apiData, type SessionUser } from "@/lib/api";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { NAV_ITEMS } from "@/lib/nav";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SessionContext = createContext<SessionUser | null>(null);
export function useSessionUser() { return useContext(SessionContext); }

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    apiData<SessionUser>("/auth/me").then((current) => {
      if (alive) setUser(current);
    }).catch((reason: unknown) => {
      const status = typeof reason === "object" && reason !== null && "status" in reason ? Number(reason.status) : undefined;
      if (status === 401) router.replace("/login?reason=session-expired");
      else if (alive) setError(reason instanceof Error ? reason.message : "Could not verify your session.");
    });
    return () => { alive = false; };
  }, [router, retry]);

  useEffect(() => {
    const expire = () => router.replace("/login?reason=session-expired");
    window.addEventListener("academic:session-expired", expire);
    return () => window.removeEventListener("academic:session-expired", expire);
  }, [router]);

  if (error) return <ErrorState title="Could not verify your session" description={error} onRetry={() => setRetry((value) => value + 1)} />;
  if (!user) return <LoadingState label="Verifying your session" />;

  const route = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  if (route && !route.roles.includes(user.role)) {
    return <ErrorState title="Access restricted" description={`The ${user.role.toLowerCase()} role cannot open this section.`} />;
  }

  async function signOut() {
    setLogoutError(null);
    try {
      await apiData("/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch (reason) { setLogoutError(reason instanceof Error ? reason.message : "Sign out failed. Retry when the API is available."); }
  }

  return (
    <SessionContext.Provider value={user}>
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={open} onClose={() => setOpen(false)} user={user} onSignOut={() => void signOut()} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setOpen(true)} alertCount={0} user={user} onSignOut={() => void signOut()} />
        <main className="px-4 py-5 xs:px-5 md:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto max-w-[1440px]">{logoutError ? <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{logoutError}</p> : null}{children}</div>
        </main>
      </div>
    </div>
    </SessionContext.Provider>
  );
}
