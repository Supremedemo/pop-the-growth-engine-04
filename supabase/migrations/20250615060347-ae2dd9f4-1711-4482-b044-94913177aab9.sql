
-- Create discovered_events table for auto-discovery of events
CREATE TABLE IF NOT EXISTS public.discovered_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_schema JSONB NOT NULL DEFAULT '{}',
  sample_payload JSONB NOT NULL DEFAULT '{}',
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  is_conversion_event BOOLEAN NOT NULL DEFAULT false,
  revenue_mapping JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(website_id, event_type)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_discovered_events_website_type ON public.discovered_events (website_id, event_type);
CREATE INDEX IF NOT EXISTS idx_discovered_events_last_seen ON public.discovered_events (last_seen DESC);

-- Enable RLS
ALTER TABLE public.discovered_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for discovered_events
CREATE POLICY "Users can view discovered events for their websites" ON public.discovered_events 
  FOR SELECT USING (
    website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage discovered events for their websites" ON public.discovered_events 
  FOR ALL USING (
    website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
  );

-- Function to trigger event discovery
CREATE OR REPLACE FUNCTION public.trigger_event_discovery(p_website_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into event queue to process discovery
  INSERT INTO public.event_queue (
    event_type,
    payload,
    priority
  ) VALUES (
    'event_discovery',
    jsonb_build_object('website_id', p_website_id),
    2
  );
  
  RETURN TRUE;
END;
$$;
