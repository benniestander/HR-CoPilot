// NOTE: This is a TypeScript file. Do not run this in a SQL Editor.
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Helper to safely get env vars from either Vite's import.meta.env or Node's process.env
const getEnvVar = (key: string): string | undefined => {
    // 1. Try Vite's import.meta.env
    try {
        const viteEnv = (import.meta as any).env;
        if (viteEnv && viteEnv[key]) return viteEnv[key];
    } catch (e) {
        // Ignore
    }

    // 2. Try Standard process.env (for tests or some bundlers)
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            // @ts-ignore
            return process.env[key];
        }
    } catch (e) {
        // Ignore
    }

    return undefined;
}

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Log a warning if missing, but allow the app to initialize with placeholders.
// This prevents immediate crashes (White Screen of Death).
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("WARNING: Supabase Environment Variables are missing. The app is running in placeholder mode. Please check your .env file.");
}

// Fallback to placeholder values.
// createClient throws an error if the URL is empty/null, so we ensure a valid string exists.
export const supabase = createClient(
    SUPABASE_URL || "https://placeholder.supabase.co", 
    SUPABASE_ANON_KEY || "placeholder-key"
);