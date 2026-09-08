-- Initial schema for "¿Dónde Está Sttutgart?" game
-- Run this in Supabase SQL Editor before applying RLS policies

-- ============================================================
-- 1. REGISTERS TABLE — game participation records
-- ============================================================
CREATE TABLE IF NOT EXISTS public.records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL CHECK (char_length(nombre) >= 2),
  telefono TEXT NOT NULL CHECK (telefono ~ '^\+57[3][0-9]{9}$'),
  juego TEXT NOT NULL CHECK (juego IN ('ruleta', 'busqueda')),
  resultado TEXT,
  consentimiento BOOLEAN NOT NULL DEFAULT false,
  consentimiento_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.records IS 'Game participation records for ruleta and busqueda games';

-- ============================================================
-- 2. ADMINS TABLE — administrator accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admins IS 'Administrator accounts with role-based access';

-- ============================================================
-- 3. AUDIT LOG TABLE — tracks admin actions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_log IS 'Audit trail for administrative actions';

-- ============================================================
-- 4. INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_records_juego ON public.records(juego);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON public.records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- ============================================================
-- 5. UPDATED_AT trigger function (optional, for future use)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Done! Now apply the RLS policies from the existing migration.
-- ============================================================
