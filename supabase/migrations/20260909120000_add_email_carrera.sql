-- Add email and carrera columns to records table
-- Run this in Supabase SQL Editor

ALTER TABLE public.records
  ADD COLUMN IF NOT EXISTS correo TEXT,
  ADD COLUMN IF NOT EXISTS carrera TEXT;

COMMENT ON COLUMN public.records.correo IS 'Email opcional del participante';
COMMENT ON COLUMN public.records.carrera IS 'Carrera de pregrado seleccionada (opcional)';