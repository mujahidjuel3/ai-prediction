"use client";

import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");try{await signIn(email,password);router.replace('/dashboard');router.refresh();}catch(e){setError(e instanceof Error?e.message:'Sign-in failed.');}finally{setBusy(false);}}
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Academic Sentinel</p><h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign in</h1><p className="mt-2 text-sm text-slate-600">Use an account created by your system administrator.</p></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" /></label><label className="block text-sm font-medium text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 block h-10 w-full rounded-md border border-slate-300 px-3" /></label>{error?<p role="alert" className="text-sm text-red-700">{error}</p>:null}<button disabled={busy} className="h-10 w-full rounded-md bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60">{busy?'Signing in…':'Sign in'}</button></form></section></main>;
}
