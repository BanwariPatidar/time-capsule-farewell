
CREATE TABLE public.capsule_opens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_key TEXT NOT NULL UNIQUE,
  ip TEXT NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX capsule_opens_ip_idx ON public.capsule_opens(ip);

GRANT ALL ON public.capsule_opens TO service_role;
ALTER TABLE public.capsule_opens ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (server route) can touch it.
