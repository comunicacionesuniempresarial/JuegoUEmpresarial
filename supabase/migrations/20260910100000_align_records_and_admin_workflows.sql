-- Align the client workflow with the records schema and admin actions.

ALTER TABLE public.records
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS records_updated_at ON public.records;
CREATE TRIGGER records_updated_at
  BEFORE UPDATE ON public.records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP POLICY IF EXISTS "public can submit records" ON public.records;
CREATE POLICY "public can submit records"
  ON public.records
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consentimiento = true
    AND consentimiento_timestamp IS NOT NULL
  );

DROP POLICY IF EXISTS "admins can update records" ON public.records;
CREATE POLICY "admins can update records"
  ON public.records
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admins
      WHERE admins.id = auth.uid()
        AND admins.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admins
      WHERE admins.id = auth.uid()
        AND admins.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "super admins can delete records" ON public.records;
CREATE POLICY "super admins can delete records"
  ON public.records
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admins
      WHERE admins.id = auth.uid()
        AND admins.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "admins can insert audit log" ON public.audit_log;
CREATE POLICY "admins can insert audit log"
  ON public.audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.admins
      WHERE admins.id = auth.uid()
        AND admins.role IN ('admin', 'super_admin')
    )
  );
