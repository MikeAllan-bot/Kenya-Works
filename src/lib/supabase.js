import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://udsspdrdvfzixwfcrekv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkc3NwZHJkdmZ6aXh3ZmNyZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjY3OTUsImV4cCI6MjA4OTc0Mjc5NX0.IR8swwIALi9xTeAfaIAmO0MhzAFnkfruy08QofuI6YM',
  { auth: { persistSession: true, autoRefreshToken: true } }
)
