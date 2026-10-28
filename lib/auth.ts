import { cookies } from 'next/headers';
import { apiUrl } from '@/lib/api-url';

export interface SessionUser { id: string; email: string; name: string; role: 'ADMIN'|'TEACHER'|'STUDENT'; }
export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const cookie = jar.getAll().map(({name,value})=>`${name}=${value}`).join('; ');
  try {
    const response = await fetch(apiUrl('/auth/me'), { headers: { cookie }, cache: 'no-store' });
    if (!response.ok) return null;
    const body = await response.json() as { data?: SessionUser };
    return body.data ?? null;
  } catch { return null; }
}
