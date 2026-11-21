import { apiData, type SessionUser } from "@/lib/api";

export async function signIn(email: string, password: string) {
  return apiData<{ user: SessionUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

/** Student self-registration. Creates a login account only; Admin must still link the academic profile. */
export async function signUp(input: { email: string; password: string; name: string }) {
  return apiData<{ user: SessionUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.trim(),
      password: input.password,
      name: input.name.trim(),
      role: "STUDENT",
    }),
  });
}

export async function signOut() {
  return apiData<{ loggedOut: boolean }>("/auth/logout", { method: "POST" });
}
