// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uvopziueauxbvbwvrrvf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2b3B6aXVlYXV4YnZid3ZycnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MTg5MDQsImV4cCI6MjA1MDQ5NDkwNH0.480xV2LewOKqqxmDd6vhdRUbBUI5kYgb0jXDA-X7DxQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);