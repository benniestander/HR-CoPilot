
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE MASTER FIX SCRIPT (RUN THIS IN SQL EDITOR)
   ==========================================================================
   
   1. Copy this entire block (between the start/end comments).
   2. Paste into Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql).
   3. Run it.
   4. IMPORTANT: After running, execute this command to make yourself admin:
      UPDATE profiles SET is_admin = true WHERE email = 'YOUR_EMAIL_ADDRESS_HERE';

   ==========================================================================

    
*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
