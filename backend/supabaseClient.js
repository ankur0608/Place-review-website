import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey || !supabaseUrl) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
