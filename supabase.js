import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://elihzyklhpfmxccfboya.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaWh6eWtsaHBmbXhjY2Zib3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM1OTMyNDksImV4cCI6MTk4OTE2OTI0OX0.evVFRl8mQUZBOGv5dhPHZBCuJERjvI38j0cfG1O4VXU')
