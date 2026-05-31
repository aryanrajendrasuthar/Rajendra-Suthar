-- Jayraj Fabrication — Seed Data
-- Run AFTER 001_initial.sql migration in Supabase SQL editor

-- SmartQuote: admin email
INSERT INTO public.app_settings (admin_email)
VALUES ('aryanrajendrasuthar@gmail.com');

-- SmartQuote: company profile
INSERT INTO public.company_profile (
  company_name, address_lines, email, phone, signature_name, logo_path
) VALUES (
  'JAYRAJ FABRICATION',
  ARRAY[
    '513, Bakor Patel Chambers, Opp. Karelibaug Police Station,',
    'Bhutdizampa, Vadodara, Gujarat – 390001.'
  ],
  'jayrajfab09@gmail.com',
  '+91 9825098819 / +91 7069536308',
  'Rajendra Suthar',
  'assets/logo.jpg'
);

-- App settings defaults
INSERT INTO public.settings (key, value) VALUES
  ('theme_default', 'auto'),
  ('whatsapp_number', '+13463325227'),
  ('gst_number', '24ALNPS3233M1ZP');
