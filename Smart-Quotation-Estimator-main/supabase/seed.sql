insert into public.app_settings (admin_email)
values ('aryansuthar51@gmail.com');

insert into public.company_profile (
  company_name, address_lines, email, phone, signature_name, logo_path
)
values (
  'JAYRAJ FABRICATION',
  array[
    '207, Richmond Plaza, Nr. Swastik Milestone,',
    'Above Dhiraj Sons, Vesu, Surat.'
  ],
  'aryansuthar51@gmail.com',
  '',
  'Rajendra Suthar',
  'assets/logo.jpg'
);