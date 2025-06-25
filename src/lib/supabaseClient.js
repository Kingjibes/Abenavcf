import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ukrwllbgwyfcalymyjvg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcndsbGJnd3lmY2FseW15anZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1Nzc1ODAsImV4cCI6MjA2NjE1MzU4MH0.TQD_T9adQuUQqVw9U2GAZ-Z3hJGQ9xI7hD4JVbbqAmE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);