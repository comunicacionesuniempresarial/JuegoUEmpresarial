-- Fix the corrupted regular expressions on the records table and make the
-- registration rate limit effective.
--
-- Symptom: every registration sent from the browser failed with
--   "new row violates row-level security policy for table \"records\""
--
-- Root cause: the phone and email patterns were stored with a doubled
-- backslash. Inside a standard conforming SQL string, `\\+` is a literal
-- backslash followed by a `+`, so the regex engine read an escaped
-- backslash and then a quantifier with no operand:
--   ERROR: invalid regular expression: quantifier operand invalid
--
-- Postgres evaluates policy expressions inside a subtransaction and turns
-- any error raised there into a policy violation, which is why the real
-- cause was reported as an RLS error. The email constraint did not even
-- raise: `\\.` simply never matched a valid address, so it silently
-- rejected every registration that included one.
--
-- The second problem was that the anti duplicate subquery read
-- public.records while the policy was being evaluated for the anon role,
-- which has no SELECT policy on that table: the subquery always came back
-- empty, so the rate limit never triggered.
--
-- Note: the live database was seeded by hand and never went through
-- 20260910100000_align_records_and_admin_workflows.sql, so the policies
-- installed here differ from the ones that migration describes. This
-- migration leaves a single insert policy on records, which works both on
-- the live database and on a database replayed from scratch.
--
-- The migration is idempotent.

-- ============================================================
-- 1. Check constraints with corrupted regular expressions
-- ============================================================
-- The phone pattern accepts both the national format (3001234567) and the
-- E.164 format (+573001234567); the application normalises to the latter
-- while the historical rows keep the former.
ALTER TABLE public.records DROP CONSTRAINT IF EXISTS records_telefono_check;
ALTER TABLE public.records
  ADD CONSTRAINT records_telefono_check
  CHECK (telefono ~ '^(\+57)?[3][0-9]{9}$');

ALTER TABLE public.records DROP CONSTRAINT IF EXISTS records_correo_check;
ALTER TABLE public.records
  ADD CONSTRAINT records_correo_check
  CHECK (
    correo IS NULL
    OR correo ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  );

-- ============================================================
-- 2. A rate limit that can actually read the table
-- ============================================================
-- SECURITY DEFINER reads the table with the privileges of its owner
-- (the table owner bypasses row level security), so the check finally
-- sees the rows written during the last minutes. Comparing the last ten
-- digits makes "+573001234567" and "3001234567" the same number.
CREATE OR REPLACE FUNCTION public.recent_registration_exists(p_telefono text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.records
    WHERE right(regexp_replace(telefono, '\D', '', 'g'), 10)
        = right(regexp_replace(p_telefono, '\D', '', 'g'), 10)
      AND created_at > now() - interval '5 minutes'
  );
$$;

REVOKE ALL ON FUNCTION public.recent_registration_exists(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recent_registration_exists(text) TO anon, authenticated;

-- ============================================================
-- 3. The insert policy
-- ============================================================
-- Consent is now required at the database level, as the client always
-- sends it: the registration form blocks the submit button until the
-- treatment of data is accepted.
--
-- Both names are dropped so a database replayed from scratch (where
-- 20260910100000 created "public can submit records") ends up with the
-- same single policy as the live database.
DROP POLICY IF EXISTS "rate limited record insert" ON public.records;
DROP POLICY IF EXISTS "public can submit records" ON public.records;

CREATE POLICY "rate limited record insert"
  ON public.records
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(nombre) >= 2
    AND telefono ~ '^(\+57)?[3][0-9]{9}$'
    AND juego IN ('ruleta', 'busqueda')
    AND consentimiento = true
    AND consentimiento_timestamp IS NOT NULL
    AND NOT public.recent_registration_exists(telefono)
  );
