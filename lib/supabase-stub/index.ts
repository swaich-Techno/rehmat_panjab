/**
 * Supabase is not linked. This stub keeps the future client shape in one place
 * so account, auth, and admin can switch without rewriting pages.
 *
 * NEVER import a service-role key here. Service role belongs only on the server
 * after credentials exist.
 */

export type AuthStatus = "disconnected";

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getPublicSupabaseConfig(): {
  configured: boolean;
  url: string | null;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
  return {
    configured: Boolean(url && anon),
    url,
  };
}

export const AUTH_DISCONNECTED_COPY = {
  title: "The private house is not connected yet.",
  body: "Your details were checked. Nothing was stored. The archive door stays closed until the house is wired to a real account service.",
};
