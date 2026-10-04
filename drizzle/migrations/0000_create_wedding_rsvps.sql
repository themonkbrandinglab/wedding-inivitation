CREATE TABLE public.wedding_rsvps (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120), guest_count integer NOT NULL CHECK (guest_count BETWEEN 1 AND 20), events text[] NOT NULL, message text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.wedding_rsvps TO anon, authenticated;
GRANT ALL ON public.wedding_rsvps TO service_role;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests may send an RSVP" ON public.wedding_rsvps FOR INSERT TO anon, authenticated WITH CHECK (array_length(events, 1) BETWEEN 1 AND 5 AND events <@ ARRAY['engagement','bangleCeremony','nalangu','muhurtham','reception']::text[] AND length(message) <= 2000);