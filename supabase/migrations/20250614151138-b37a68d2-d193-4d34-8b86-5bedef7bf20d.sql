
-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Modal', 'Slide-in', 'Banner', 'Fullscreen')),
  status TEXT NOT NULL CHECK (status IN ('Active', 'Paused', 'Draft', 'Scheduled')) DEFAULT 'Draft',
  template TEXT,
  impressions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns table
CREATE POLICY "Users can view their own campaigns" 
  ON public.campaigns 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
  ON public.campaigns 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
  ON public.campaigns 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
  ON public.campaigns 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create analytics events table for detailed tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'conversion', 'revenue')),
  value DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for analytics events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for analytics events (users can only see events for their campaigns)
CREATE POLICY "Users can view events for their campaigns" 
  ON public.analytics_events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = analytics_events.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events for their campaigns" 
  ON public.analytics_events 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = analytics_events.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

-- Create function to update campaign stats when events are added
CREATE OR REPLACE FUNCTION public.update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'impression' THEN
    UPDATE public.campaigns 
    SET impressions = impressions + 1, updated_at = now()
    WHERE id = NEW.campaign_id;
  ELSIF NEW.event_type = 'conversion' THEN
    UPDATE public.campaigns 
    SET conversions = conversions + 1, updated_at = now()
    WHERE id = NEW.campaign_id;
  ELSIF NEW.event_type = 'revenue' THEN
    UPDATE public.campaigns 
    SET revenue = revenue + NEW.value, updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update campaign stats
CREATE TRIGGER on_analytics_event_created
  AFTER INSERT ON public.analytics_events
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_stats();
