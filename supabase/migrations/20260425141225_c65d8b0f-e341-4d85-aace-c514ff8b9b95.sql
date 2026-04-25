
-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own conversations" ON public.conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own conversations" ON public.conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own conversations" ON public.conversations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'received',
  room TEXT NOT NULL DEFAULT '402',
  details JSONB DEFAULT '{}'::jsonb,
  photo_url TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own requests" ON public.requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own requests" ON public.requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own requests" ON public.requests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, place_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('request-photos', 'request-photos', true);

CREATE POLICY "Authenticated users upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'request-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Public read photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'request-photos');
CREATE POLICY "Users delete own photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'request-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
