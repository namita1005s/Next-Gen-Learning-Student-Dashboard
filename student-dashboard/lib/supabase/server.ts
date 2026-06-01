import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(url, anonKey, {
    cookies: {
      async getAll() {
        const store = await cookieStore;
        return store.getAll();
      },
      async setAll(cookiesToSet) {
        try {
          const store = await cookieStore;
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options)
          );
        } catch {
          // Can be ignored if called from a Server Component
        }
      },
    },
  });
}
