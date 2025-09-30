-- Drop all existing policies on admin_users table
DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy: Only admins can view admin_users table
CREATE POLICY "Only admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Prevent all other operations (no INSERT, UPDATE, DELETE for anyone)
-- This ensures admin users can only be managed via direct database access
CREATE POLICY "Prevent public modifications to admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);