
-- Create a queue system for handling events
CREATE TABLE IF NOT EXISTS public.event_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER NOT NULL DEFAULT 5,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  last_error TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_event_queue_status_priority ON public.event_queue (status, priority DESC, scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_event_queue_event_type ON public.event_queue (event_type);

-- Create campaign deployments table to track live campaigns
CREATE TABLE IF NOT EXISTS public.campaign_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'stopped')),
  rules JSONB NOT NULL DEFAULT '{}',
  deployment_config JSONB NOT NULL DEFAULT '{}',
  deployed_at TIMESTAMP WITH TIME ZONE,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER NOT NULL DEFAULT 0,
  conversion_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, website_id)
);

-- Create campaign analytics table for real-time data
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.campaign_deployments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion', 'close', 'form_submit')),
  user_session TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  page_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  revenue_value DECIMAL(10,2) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_timestamp ON public.campaign_analytics (campaign_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_website_timestamp ON public.campaign_analytics (website_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_event_type ON public.campaign_analytics (event_type, timestamp DESC);

-- Enable RLS on new tables
ALTER TABLE public.event_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for event_queue (admin/system access only)
CREATE POLICY "System can manage event queue" ON public.event_queue FOR ALL USING (true);

-- RLS policies for campaign_deployments
CREATE POLICY "Users can view their campaign deployments" ON public.campaign_deployments 
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their campaign deployments" ON public.campaign_deployments 
  FOR ALL USING (
    campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid())
  );

-- RLS policies for campaign_analytics
CREATE POLICY "Users can view their campaign analytics" ON public.campaign_analytics 
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can insert campaign analytics" ON public.campaign_analytics 
  FOR INSERT WITH CHECK (true);

-- Function to process queue events
CREATE OR REPLACE FUNCTION public.process_queue_event(event_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_record RECORD;
  deployment_record RECORD;
BEGIN
  -- Get the event
  SELECT * INTO event_record FROM public.event_queue WHERE id = event_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Mark as processing
  UPDATE public.event_queue 
  SET status = 'processing', updated_at = now() 
  WHERE id = event_id;
  
  -- Process based on event type
  CASE event_record.event_type
    WHEN 'campaign_deploy' THEN
      -- Deploy campaign to website
      INSERT INTO public.campaign_deployments (
        campaign_id, 
        website_id, 
        status, 
        rules, 
        deployment_config,
        deployed_at
      ) VALUES (
        (event_record.payload->>'campaign_id')::UUID,
        (event_record.payload->>'website_id')::UUID,
        'active',
        event_record.payload->'rules',
        event_record.payload->'config',
        now()
      ) ON CONFLICT (campaign_id, website_id) DO UPDATE SET
        status = 'active',
        rules = EXCLUDED.rules,
        deployment_config = EXCLUDED.deployment_config,
        deployed_at = now(),
        updated_at = now();
        
    WHEN 'campaign_pause' THEN
      -- Pause campaign deployment
      UPDATE public.campaign_deployments 
      SET status = 'paused', updated_at = now()
      WHERE campaign_id = (event_record.payload->>'campaign_id')::UUID;
      
    WHEN 'campaign_stop' THEN
      -- Stop campaign deployment
      UPDATE public.campaign_deployments 
      SET status = 'stopped', updated_at = now()
      WHERE campaign_id = (event_record.payload->>'campaign_id')::UUID;
  END CASE;
  
  -- Mark as completed
  UPDATE public.event_queue 
  SET status = 'completed', processed_at = now(), updated_at = now() 
  WHERE id = event_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Mark as failed and record error
    UPDATE public.event_queue 
    SET 
      status = 'failed', 
      last_error = SQLERRM,
      attempts = attempts + 1,
      updated_at = now()
    WHERE id = event_id;
    RETURN FALSE;
END;
$$;

-- Function to queue campaign deployment
CREATE OR REPLACE FUNCTION public.queue_campaign_deployment(
  p_campaign_id UUID,
  p_website_id UUID,
  p_rules JSONB DEFAULT '{}',
  p_config JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  queue_id UUID;
BEGIN
  INSERT INTO public.event_queue (
    event_type,
    payload,
    priority
  ) VALUES (
    'campaign_deploy',
    jsonb_build_object(
      'campaign_id', p_campaign_id,
      'website_id', p_website_id,
      'rules', p_rules,
      'config', p_config
    ),
    1
  ) RETURNING id INTO queue_id;
  
  RETURN queue_id;
END;
$$;
