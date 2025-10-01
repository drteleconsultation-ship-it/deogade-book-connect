-- CRITICAL SECURITY FIX: Restrict public access to appointments table
-- This prevents unauthorized users from viewing sensitive patient data

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public to create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can delete all appointments" ON public.appointments;

-- SELECT: Only admins can view appointments
CREATE POLICY "Only admins can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- INSERT: Allow public (anonymous) users to create appointments
CREATE POLICY "Public can create appointments"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- UPDATE: Only admins can update appointments
CREATE POLICY "Only admins can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- DELETE: Only admins can delete appointments
CREATE POLICY "Only admins can delete appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- Strengthen function_rate_limits security
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.function_rate_limits;

-- Only service role can manage rate limits
CREATE POLICY "Service role full access to rate limits"
ON public.function_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Prevent any other access to rate limits table
CREATE POLICY "Deny all other access to rate limits"
ON public.function_rate_limits
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);