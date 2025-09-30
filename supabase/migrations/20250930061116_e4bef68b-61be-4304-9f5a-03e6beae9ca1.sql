-- Fix search_path for cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.function_rate_limits
  WHERE window_start < now() - INTERVAL '24 hours';
END;
$$;