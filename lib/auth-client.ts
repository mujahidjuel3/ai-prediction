import { apiData, type SessionUser } from "@/lib/api";

export async function signIn(email: string, password: string) {
  return apiData<{ user: SessionUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

export async function signOut() {
  return apiData<{ loggedOut: boolean }>("/auth/logout", { method: "POST" });
}
