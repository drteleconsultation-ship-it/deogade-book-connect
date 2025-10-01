-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;

-- Create a proper permissive INSERT policy that allows anyone to create appointments
CREATE POLICY "Allow public to create appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);