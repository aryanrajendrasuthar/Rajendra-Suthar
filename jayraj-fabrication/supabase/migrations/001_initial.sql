-- Jayraj Fabrication — Digital Ecosystem
-- Full schema: public site + admin + SmartQuote ERP
-- Run in Supabase SQL editor (MANUAL-01)

-- ============================================
-- INQUIRIES (public contact form submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  company     TEXT,
  phone       TEXT NOT NULL,
  email       TEXT,
  city        TEXT,
  service     TEXT, -- industrial_peb|tensile|elevation|commercial|residential|roofing|other
  description TEXT,
  contact_pref TEXT, -- whatsapp|email|call
  source      TEXT,
  status      TEXT DEFAULT 'new', -- new|in_progress|converted|closed
  notes       TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GALLERY (Cloudinary metadata — no binaries)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id            BIGSERIAL PRIMARY KEY,
  cloudinary_id TEXT NOT NULL, -- e.g. jayraj-fabrication/gallery/tensile/img1
  public_url    TEXT NOT NULL, -- Cloudinary CDN URL
  category      TEXT NOT NULL, -- industrial_peb|tensile|elevation|commercial|residential|roofing
  description   TEXT,
  is_featured   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  upload_date   TIMESTAMPTZ DEFAULT NOW(),
  sort_order    INT DEFAULT 0,
  width         INT,
  height        INT,
  blur_url      TEXT
);

-- ============================================
-- SMARTQUOTE ERP — App Settings
-- ============================================
CREATE TABLE IF NOT EXISTS public.app_settings (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_email TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SMARTQUOTE ERP — Company Profile
-- ============================================
CREATE TABLE IF NOT EXISTS public.company_profile (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_name   TEXT NOT NULL,
  address_lines  TEXT[] NOT NULL DEFAULT '{}',
  email          TEXT,
  phone          TEXT,
  signature_name TEXT,
  logo_path      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SMARTQUOTE ERP — Clients
-- ============================================
CREATE TABLE IF NOT EXISTS public.clients (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           TEXT NOT NULL,
  address_lines  TEXT[] NOT NULL DEFAULT '{}',
  city           TEXT,
  contact_person TEXT,
  phone          TEXT,
  email          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SMARTQUOTE ERP — Quotes
-- ============================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_no         TEXT NOT NULL, -- e.g. F-008, F-031
  quote_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id        BIGINT REFERENCES public.clients(id) ON DELETE SET NULL,
  to_name          TEXT,
  to_address_lines TEXT[] NOT NULL DEFAULT '{}',
  kind_attn        TEXT,
  subject          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT|SENT|APPROVED|REJECTED|ORDERED
  validity_days    INT NOT NULL DEFAULT 7,
  notes_lines      TEXT[] NOT NULL DEFAULT '{}',
  terms_lines      TEXT[] NOT NULL DEFAULT '{}',
  subtotal         NUMERIC(12,2),
  gst_amount       NUMERIC(12,2),
  total            NUMERIC(12,2),
  inquiry_id       BIGINT REFERENCES public.inquiries(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SMARTQUOTE ERP — Quote Items
-- ============================================
CREATE TABLE IF NOT EXISTS public.quote_items (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id      BIGINT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  line_no       INT NOT NULL,
  title         TEXT NOT NULL,
  include_lines TEXT[] NOT NULL DEFAULT '{}',
  qty           NUMERIC(12,3) NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT 'SQFT',
  rate          NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount        NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (quote_id, line_no)
);

-- ============================================
-- SMARTQUOTE ERP — Quote Extras
-- ============================================
CREATE TABLE IF NOT EXISTS public.quote_extras (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id   BIGINT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  line_no    INT NOT NULL,
  label      TEXT NOT NULL,
  extra_type TEXT NOT NULL CHECK (extra_type IN ('EXTRA_TEXT', 'AMOUNT')),
  amount     NUMERIC(14,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (quote_id, line_no)
);

-- ============================================
-- SMARTQUOTE ERP — Quote Exports (PDF log)
-- ============================================
CREATE TABLE IF NOT EXISTS public.quote_exports (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id     BIGINT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- HOLIDAY CARDS LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_cards (
  id             BIGSERIAL PRIMARY KEY,
  festival_name  TEXT,
  festival_date  DATE,
  template_used  TEXT,
  format         TEXT, -- square|story
  custom_message TEXT,
  generated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUTO updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_inquiries_updated
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_company_profile_updated
  BEFORE UPDATE ON public.company_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_clients_updated
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_quotes_updated
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_quote_items_updated
  BEFORE UPDATE ON public.quote_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_quote_extras_updated
  BEFORE UPDATE ON public.quote_extras
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- is_admin() helper (email-based, SmartQuote)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'email') = (
      SELECT admin_email FROM public.app_settings ORDER BY id ASC LIMIT 1
    ),
    false
  );
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_extras   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_exports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings       ENABLE ROW LEVEL SECURITY;

-- Public: read active gallery images
CREATE POLICY "public_gallery_read" ON public.gallery_images
  FOR SELECT USING (is_active = true);

-- Public: insert inquiries
CREATE POLICY "public_inquiry_insert" ON public.inquiries
  FOR INSERT WITH CHECK (true);

-- Authenticated: full access to all admin tables
CREATE POLICY "auth_inquiries_all"      ON public.inquiries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_gallery_all"        ON public.gallery_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_quotes_all"         ON public.quotes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_quote_items_all"    ON public.quote_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_quote_extras_all"   ON public.quote_extras
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_quote_exports_all"  ON public.quote_exports
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_app_settings_all"   ON public.app_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "auth_company_profile_all" ON public.company_profile
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_clients_all"        ON public.clients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_generated_cards_all" ON public.generated_cards
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "auth_settings_all"       ON public.settings
  FOR ALL USING (auth.role() = 'authenticated');
