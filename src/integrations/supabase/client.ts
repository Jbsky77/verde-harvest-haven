
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dytvesqswrviedmojbdb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dHZlc3Fzd3J2aWVkbW9qYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NTc2MDAsImV4cCI6MjA1NjUzMzYwMH0.KuEQBYcPMP2iQY2CzhzLuFxdcgV0oQcoTm2WYTJQjTw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
