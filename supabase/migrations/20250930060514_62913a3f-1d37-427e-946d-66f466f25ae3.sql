-- Insert admin user email
INSERT INTO public.admin_users (email, is_active)
VALUES ('drteleconsultation@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET is_active = true;