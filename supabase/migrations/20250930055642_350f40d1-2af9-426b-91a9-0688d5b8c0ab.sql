-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id 
    AND is_active = true
  );
$$;

-- Drop the dangerous "Allow all access to appointments" policy
DROP POLICY IF EXISTS "Allow all access to appointments" ON public.appointments;

-- Create secure RLS policies for appointments table
-- Admins can view all appointments
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admins can update all appointments
CREATE POLICY "Admins can update all appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admins can delete appointments
CREATE POLICY "Admins can delete all appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Public users can insert appointments (for booking form)
CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Update admin_users RLS policy
DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;

CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));