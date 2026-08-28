import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sivqocijzkccibscgldg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdnFvY2lqemtjY2lic2NnbGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDM1MjQsImV4cCI6MjEwMzQxOTUyNH0.1ao8kNv4vO_EhPga1aw6p_---uvbRjvpg62Vq68Rkqs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
