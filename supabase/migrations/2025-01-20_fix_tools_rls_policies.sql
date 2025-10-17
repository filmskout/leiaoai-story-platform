-- Modify RLS policies to allow service role insertions
-- This allows scripts to insert while maintaining security

-- Drop existing tools policies
DROP POLICY IF EXISTS "tools_read_all" ON public.tools;
DROP POLICY IF EXISTS "tools_insert_auth" ON public.tools;
DROP POLICY IF EXISTS "tools_update_auth" ON public.tools;
DROP POLICY IF EXISTS "tools_delete_auth" ON public.tools;

-- Create new policies that allow service role operations
CREATE POLICY "tools_read_all" ON public.tools FOR SELECT USING (true);

CREATE POLICY "tools_insert_service_role" ON public.tools FOR INSERT 
TO service_role WITH CHECK (true);

CREATE POLICY "tools_insert_auth" ON public.tools FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "tools_update_service_role" ON public.tools FOR UPDATE 
TO service_role USING (true);

CREATE POLICY "tools_update_auth" ON public.tools FOR UPDATE 
TO authenticated USING (true);

CREATE POLICY "tools_delete_service_role" ON public.tools FOR DELETE 
TO service_role USING (true);

CREATE POLICY "tools_delete_auth" ON public.tools FOR DELETE 
TO authenticated USING (true);
