-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'owner', 'manager', 'staff');
CREATE TYPE public.staff_role AS ENUM ('owner', 'manager', 'frontdesk', 'housekeeping', 'kitchen', 'engineering', 'spa', 'concierge');
CREATE TYPE public.subscription_tier AS ENUM ('trial', 'small', 'medium', 'pro');
CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled');
CREATE TYPE public.guest_tier AS ENUM ('standard', 'silver', 'gold', 'platinum');
CREATE TYPE public.request_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE public.menu_category AS ENUM ('dining', 'spa', 'minibar', 'laundry');
CREATE TYPE public.place_category AS ENUM ('food', 'culture', 'nightlife', 'nature', 'shopping');

-- ============ HOTELS ============
CREATE TABLE public.hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  city text NOT NULL,
  country text DEFAULT 'KZ',
  stars int CHECK (stars BETWEEN 1 AND 5),
  rooms_count int,
  description text,
  logo_url text,
  cover_url text,
  subscription_tier subscription_tier DEFAULT 'trial',
  subscription_status subscription_status DEFAULT 'trialing',
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  branding jsonb DEFAULT '{}'::jsonb,
  languages text[] DEFAULT ARRAY['ru','en','kk','zh','ko','ar','de','fr'],
  ai_voice text DEFAULT 'warm',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, hotel_id, role)
);

-- Security definer helpers (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.user_hotel_ids(_user_id uuid)
RETURNS SETOF uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT hotel_id FROM public.user_roles WHERE user_id = _user_id AND hotel_id IS NOT NULL
$$;

CREATE OR REPLACE FUNCTION public.user_works_at(_user_id uuid, _hotel_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND (hotel_id = _hotel_id OR role = 'super_admin')
  )
$$;

-- ============ HOTEL STAFF ============
CREATE TABLE public.hotel_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  role staff_role NOT NULL,
  email text,
  phone text,
  avatar_url text,
  is_on_duty boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ GUESTS ============
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  full_name text,
  initials text,
  language_pref text DEFAULT 'ru',
  tier guest_tier DEFAULT 'standard',
  loyalty_points int DEFAULT 0,
  preferences jsonb DEFAULT '{}'::jsonb,
  allergies text[],
  dietary_restrictions text[],
  check_in date,
  check_out date,
  pms_guest_id text,
  access_token text UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guests_hotel_room ON public.guests(hotel_id, room_number);
CREATE INDEX idx_guests_token ON public.guests(access_token);

-- ============ SERVICE MENUS ============
CREATE TABLE public.service_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  category menu_category NOT NULL,
  name jsonb NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'KZT',
  emoji text,
  image_url text,
  available boolean DEFAULT true,
  tags text[],
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ PLACES ============
CREATE TABLE public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  category place_category NOT NULL,
  name jsonb NOT NULL,
  description jsonb DEFAULT '{}'::jsonb,
  tag text,
  distance_km numeric(4,2),
  rating numeric(2,1),
  reviews_count int DEFAULT 0,
  price_range text,
  image_url text,
  partner_commission numeric(5,2) DEFAULT 0,
  is_partner boolean DEFAULT false,
  contact_phone text,
  open_hours jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ EXTEND CONVERSATIONS ============
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS language text DEFAULT 'ru',
  ADD COLUMN IF NOT EXISTS channel text DEFAULT 'qr',
  ADD COLUMN IF NOT EXISTS sentiment text DEFAULT 'neutral',
  ADD COLUMN IF NOT EXISTS sentiment_score numeric(3,2),
  ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS escalated_to uuid REFERENCES public.hotel_staff(id),
  ADD COLUMN IF NOT EXISTS message_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_message_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ALTER COLUMN user_id DROP NOT NULL;

-- ============ EXTEND REQUESTS ============
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES public.guests(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS priority request_priority DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.hotel_staff(id),
  ADD COLUMN IF NOT EXISTS assigned_team text,
  ADD COLUMN IF NOT EXISTS eta_minutes int,
  ADD COLUMN IF NOT EXISTS routed_at timestamptz,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ALTER COLUMN user_id DROP NOT NULL;

-- ============ DEMO LEADS ============
CREATE TABLE public.demo_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  rooms_count int,
  stars int,
  position text,
  preferred_lang text,
  challenges text[],
  message text,
  source text DEFAULT 'landing',
  status text DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ ENABLE RLS ============
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_leads ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- hotels: public read (for landing/widget), staff updates own, super_admin all
CREATE POLICY "hotels_public_read" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "hotels_staff_update" ON public.hotels FOR UPDATE TO authenticated
  USING (public.user_works_at(auth.uid(), id));
CREATE POLICY "hotels_super_admin_all" ON public.hotels FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- user_roles: users see their own, super_admin sees all
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "user_roles_super_admin_write" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- hotel_staff: staff see colleagues at their hotel
CREATE POLICY "staff_read_colleagues" ON public.hotel_staff FOR SELECT TO authenticated
  USING (public.user_works_at(auth.uid(), hotel_id));
CREATE POLICY "staff_manage" ON public.hotel_staff FOR ALL TO authenticated
  USING (public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (public.user_works_at(auth.uid(), hotel_id));

-- guests: hotel staff full access; public read for token-based widget access (anon needs read by token)
CREATE POLICY "guests_staff_all" ON public.guests FOR ALL TO authenticated
  USING (public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (public.user_works_at(auth.uid(), hotel_id));
CREATE POLICY "guests_public_read" ON public.guests FOR SELECT USING (true);

-- service_menus: public read (widget), staff manage
CREATE POLICY "menus_public_read" ON public.service_menus FOR SELECT USING (true);
CREATE POLICY "menus_staff_write" ON public.service_menus FOR ALL TO authenticated
  USING (public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (public.user_works_at(auth.uid(), hotel_id));

-- places: public read, staff manage
CREATE POLICY "places_public_read" ON public.places FOR SELECT USING (true);
CREATE POLICY "places_staff_write" ON public.places FOR ALL TO authenticated
  USING (public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (public.user_works_at(auth.uid(), hotel_id));

-- demo_leads: anyone can submit, only super_admin reads
CREATE POLICY "leads_anyone_insert" ON public.demo_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_super_admin_read" ON public.demo_leads FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));
CREATE POLICY "leads_super_admin_update" ON public.demo_leads FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- Drop old user-scoped policies on requests/conversations and add hotel-scoped ones
DROP POLICY IF EXISTS "Users view own requests" ON public.requests;
DROP POLICY IF EXISTS "Users insert own requests" ON public.requests;
DROP POLICY IF EXISTS "Users update own requests" ON public.requests;
DROP POLICY IF EXISTS "Users view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users delete own conversations" ON public.conversations;

-- requests: staff see/manage hotel requests; public insert (from widget) and read by guest_id (token gated in app)
CREATE POLICY "requests_staff_all" ON public.requests FOR ALL TO authenticated
  USING (hotel_id IS NULL OR public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (hotel_id IS NULL OR public.user_works_at(auth.uid(), hotel_id));
CREATE POLICY "requests_public_insert" ON public.requests FOR INSERT WITH CHECK (true);
CREATE POLICY "requests_public_read" ON public.requests FOR SELECT USING (true);

-- conversations: staff hotel-scoped; widget needs read/write
CREATE POLICY "conv_staff_all" ON public.conversations FOR ALL TO authenticated
  USING (hotel_id IS NULL OR public.user_works_at(auth.uid(), hotel_id))
  WITH CHECK (hotel_id IS NULL OR public.user_works_at(auth.uid(), hotel_id));
CREATE POLICY "conv_public_rw" ON public.conversations FOR ALL USING (true) WITH CHECK (true);

-- ============ TRIGGERS ============
CREATE TRIGGER set_hotels_updated_at BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_guests_updated_at BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ============ DEMO SEED ============
INSERT INTO public.hotels (id, slug, name, city, stars, rooms_count, description, subscription_tier, subscription_status, trial_ends_at, branding)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'grand-almaty',
  'Grand Almaty Hotel',
  'Алматы',
  5, 180,
  'Флагманский отель meken.ai в сердце Алматы — у подножия Заилийского Алатау.',
  'pro', 'active', now() + interval '1 year',
  '{"primary":"#C9A84C","accent":"#0D1B37"}'::jsonb
);

INSERT INTO public.guests (id, hotel_id, room_number, full_name, initials, language_pref, tier, loyalty_points, preferences, allergies, check_in, check_out, access_token)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '402', 'Маркус Чен', 'МЧ', 'ru', 'gold', 6840,
  '{"cuisine":"итальянская","pillow":"мягкая","temperature":21,"music":"джаз","wakeup":"07:30"}'::jsonb,
  ARRAY['морепродукты'],
  CURRENT_DATE - 2, CURRENT_DATE + 2,
  'demo402token'
);

INSERT INTO public.service_menus (hotel_id, category, name, description, price, currency, emoji, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'dining', '{"ru":"Континентальный завтрак","en":"Continental breakfast","kk":"Континентал таңғы ас"}', '{"ru":"Круассаны, сыр, фрукты, эспрессо"}', 6500, 'KZT', '🥐', 1),
  ('11111111-1111-1111-1111-111111111111', 'dining', '{"ru":"Бешбармак","en":"Beshbarmak","kk":"Бесбармақ"}', '{"ru":"Традиционное казахское блюдо"}', 8900, 'KZT', '🍲', 2),
  ('11111111-1111-1111-1111-111111111111', 'dining', '{"ru":"Паста Карбонара","en":"Pasta Carbonara"}', '{"ru":"Классическая итальянская паста"}', 7200, 'KZT', '🍝', 3),
  ('11111111-1111-1111-1111-111111111111', 'spa', '{"ru":"Стоунтерапия","en":"Hot stone massage","kk":"Тас терапиясы"}', '{"ru":"60 минут с Еленой"}', 32000, 'KZT', '🪨', 1),
  ('11111111-1111-1111-1111-111111111111', 'spa', '{"ru":"Хаммам","en":"Hammam","kk":"Хамам"}', '{"ru":"Турецкая баня, 90 минут"}', 28000, 'KZT', '♨️', 2),
  ('11111111-1111-1111-1111-111111111111', 'minibar', '{"ru":"Эспрессо двойной","en":"Double espresso"}', '{"ru":"Свежемолотый кофе"}', 1800, 'KZT', '☕', 1);

INSERT INTO public.places (hotel_id, category, name, description, tag, distance_km, rating, reviews_count, price_range, is_partner, partner_commission, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'food', '{"ru":"Auyl","en":"Auyl"}', '{"ru":"Современная казахская кухня в этно-интерьере"}', 'Казахская', 1.2, 4.8, 1240, '$$$', true, 8, 1),
  ('11111111-1111-1111-1111-111111111111', 'food', '{"ru":"Del Papa","en":"Del Papa"}', '{"ru":"Лучшая итальянская паста в городе"}', 'Итальянская', 0.8, 4.7, 890, '$$', true, 7, 2),
  ('11111111-1111-1111-1111-111111111111', 'culture', '{"ru":"Государственный музей искусств","en":"Kasteyev Museum"}', '{"ru":"Крупнейшая коллекция искусства Центральной Азии"}', 'Музей', 2.4, 4.6, 520, '$', false, 0, 3),
  ('11111111-1111-1111-1111-111111111111', 'nature', '{"ru":"Медеу","en":"Medeu"}', '{"ru":"Высокогорный каток на высоте 1691 м"}', 'Горы', 14.5, 4.9, 3200, '$', false, 0, 4);