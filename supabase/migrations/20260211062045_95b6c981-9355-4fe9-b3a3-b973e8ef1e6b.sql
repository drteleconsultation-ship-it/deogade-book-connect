
-- Create page_visits table for tracking visitor analytics
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_path TEXT NOT NULL DEFAULT '/',
  country_code TEXT,
  country_name TEXT,
  user_agent TEXT,
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert visits (anonymous tracking)
CREATE POLICY "Anyone can log visits"
  ON public.page_visits FOR INSERT
  WITH CHECK (true);

-- Anyone can read visit stats (public analytics)
CREATE POLICY "Anyone can view visits"
  ON public.page_visits FOR SELECT
  USING (true);

-- Index for fast date queries
CREATE INDEX idx_page_visits_visited_at ON public.page_visits (visited_at DESC);
CREATE INDEX idx_page_visits_country ON public.page_visits (country_code);
