-- Update appointments table to store multiple attachment URLs
ALTER TABLE public.appointments
DROP COLUMN IF EXISTS attachment_url;

ALTER TABLE public.appointments
ADD COLUMN attachment_urls text[] DEFAULT ARRAY[]::text[];