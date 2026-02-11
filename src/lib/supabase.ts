import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables (URL or Anon Key)');
}

/**
 * Client-side Supabase client for components
 * Uses anon key with RLS enabled
 * Named 'supabase' for backward compatibility with existing project files
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Alias for supabase client for clarity in new components
 */
export const supabaseClient = supabase;

/**
 * Server-side Supabase client for API routes and scripts
 * Uses service role key to bypass RLS.
 * Note: This will be null on the client-side.
 */
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null as any;
