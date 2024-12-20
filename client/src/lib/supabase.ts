import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
