
-- Fix search_path on trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Tighten storage policy: only owner can read their own photos in request-photos
DROP POLICY IF EXISTS "Public read photos" ON storage.objects;

CREATE POLICY "Users read own request photos" ON storage.objects
  FOR SELECT TO authenticated 
  USING (bucket_id = 'request-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Make bucket private (we'll use signed URLs)
UPDATE storage.buckets SET public = false WHERE id = 'request-photos';
