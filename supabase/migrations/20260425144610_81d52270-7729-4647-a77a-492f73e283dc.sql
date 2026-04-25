-- Helper: validate that a guest_id belongs to hotel_id and token matches what's set in request header
CREATE OR REPLACE FUNCTION public.guest_token_valid(_guest_id uuid, _hotel_id uuid, _token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guests
    WHERE id = _guest_id
      AND hotel_id = _hotel_id
      AND access_token = _token
      AND is_active = true
  )
$$;

-- Replace permissive INSERT policies with token-validated ones
DROP POLICY IF EXISTS "requests_public_insert" ON public.requests;
DROP POLICY IF EXISTS "conv_public_rw" ON public.conversations;

-- Requests: anonymous insert only when guest token matches
CREATE POLICY "requests_widget_insert" ON public.requests FOR INSERT
  WITH CHECK (
    guest_id IS NOT NULL
    AND hotel_id IS NOT NULL
    AND public.guest_token_valid(
      guest_id,
      hotel_id,
      current_setting('request.headers', true)::json ->> 'x-guest-token'
    )
  );

-- Conversations: anonymous insert only when guest token matches
CREATE POLICY "conv_widget_insert" ON public.conversations FOR INSERT
  WITH CHECK (
    guest_id IS NOT NULL
    AND hotel_id IS NOT NULL
    AND public.guest_token_valid(
      guest_id,
      hotel_id,
      current_setting('request.headers', true)::json ->> 'x-guest-token'
    )
  );

CREATE POLICY "conv_widget_update" ON public.conversations FOR UPDATE
  USING (
    public.guest_token_valid(
      guest_id,
      hotel_id,
      current_setting('request.headers', true)::json ->> 'x-guest-token'
    )
  );

-- Demo leads: tighter check — non-empty fields, reasonable length
DROP POLICY IF EXISTS "leads_anyone_insert" ON public.demo_leads;
CREATE POLICY "leads_validated_insert" ON public.demo_leads FOR INSERT
  WITH CHECK (
    char_length(hotel_name) BETWEEN 1 AND 200
    AND char_length(contact_name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 5 AND 200
    AND email LIKE '%@%.%'
  );