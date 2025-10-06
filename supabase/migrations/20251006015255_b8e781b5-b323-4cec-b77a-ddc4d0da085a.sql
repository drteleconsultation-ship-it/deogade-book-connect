-- Add payment method column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN payment_method text NOT NULL DEFAULT 'upi';