-- Create rate limiting table for edge functions
CREATE TABLE IF NOT EXISTS public.function_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  function_name TEXT NOT NULL,
  identifier TEXT NOT NULL, -- IP address or user identifier
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(function_name, identifier, window_start)
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_function_rate_limits_lookup 
ON public.function_rate_limits(function_name, identifier, window_start);

-- Enable RLS
ALTER TABLE public.function_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits"
ON public.function_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.function_rate_limits
  WHERE window_start < now() - INTERVAL '24 hours';
END;
$$;