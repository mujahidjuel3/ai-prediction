"use client";

import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Mode = "signin" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (password.length < 14) throw new Error("Password must be at least 14 characters.");
        await signUp({ email, password, name });
      } else {
        await signIn(email, password);
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : mode === "register" ? "Registration failed." : "Sign-in failed.");
      if (mode === "register") setPassword("");
      if (mode === "register") setConfirmPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Academic Sentinel</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{mode === "signin" ? "Sign in" : "Create student account"}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {mode === "signin"
              ? "Use your institutional account. Administrators provision Teacher accounts and academic profiles separately."
              : "Registers a Student login only. An administrator must still link your academic student profile."}
          </p>
        </div>
        <div className="mb-4 flex gap-2 rounded-lg bg-slate-100 p-1 text-sm">
          <button type="button" className={`flex-1 rounded-md px-3 py-2 ${mode === "signin" ? "bg-white font-medium shadow-sm" : "text-slate-600"}`} onClick={() => { setMode("signin"); setError(""); }}>Sign in</button>
          <button type="button" className={`flex-1 rounded-md px-3 py-2 ${mode === "register" ? "bg-white font-medium shadow-sm" : "text-slate-600"}`} onClick={() => { setMode("register"); setError(""); }}>Student register</button>
        </div>
        <form onSubmit={(event) => void submit(event)} className="space-y-4">
          {mode === "register" ? (
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input required minLength={2} maxLength={160} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" />
            </label>
          ) : null}
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input required type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={mode === "register" ? 14 : 1} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" />
          </label>
          {mode === "register" ? (
            <label className="block text-sm font-medium text-slate-700">
              Confirm password
              <input required type="password" autoComplete="new-password" minLength={14} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" />
            </label>
          ) : null}
          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          <button disabled={busy} className="h-10 w-full rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60">
            {busy ? (mode === "register" ? "Creating account…" : "Signing in…") : mode === "register" ? "Create student account" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
          Administrator accounts are created only by an authorized administrator. Public Admin registration is not available.{" "}
          <Link href="/" className="underline">Return home</Link>
        </p>
      </section>
    </main>
  );
}
