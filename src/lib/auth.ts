import type { AstroCookies } from 'astro';
import { supabase } from './supabase';

const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

export async function getAuthUser(cookies: AstroCookies) {
  const token = cookies.get('sb-access-token')?.value;
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function verifyAuth(cookies: AstroCookies): Promise<boolean> {
  return (await getAuthUser(cookies)) !== null;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// Autorización para rutas/páginas de administración: exige sesión válida
// y que el email pertenezca a la lista blanca ADMIN_EMAILS.
export async function verifyAdmin(cookies: AstroCookies): Promise<boolean> {
  const user = await getAuthUser(cookies);
  return isAdminEmail(user?.email);
}
