
-- =========================
-- 1. WEBHOOK TABLE & POLICIES
-- =========================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'POST',
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  auth_type TEXT NOT NULL DEFAULT 'none',
  auth_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_tested_at TIMESTAMPTZ,
  last_test_status TEXT,
  last_test_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Only allow users to view/create/update/delete their own webhooks
CREATE POLICY "Select own webhooks" ON public.webhooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own webhooks" ON public.webhooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own webhooks" ON public.webhooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own webhooks" ON public.webhooks FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- 2. FORM SUBMISSION RULES TABLE (used for automations)
-- =========================
CREATE TABLE IF NOT EXISTS public.form_submission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  campaign_id UUID,
  template_id UUID,
  name TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  actions JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submission_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Select own rules" ON public.form_submission_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own rules" ON public.form_submission_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own rules" ON public.form_submission_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own rules" ON public.form_submission_rules FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- 3. FORM SUBMISSIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rule_id UUID REFERENCES public.form_submission_rules(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  delivered_webhook_ids UUID[],
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Select own form submissions" ON public.form_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own form submissions" ON public.form_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own form submissions" ON public.form_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own form submissions" ON public.form_submissions FOR DELETE USING (auth.uid() = user_id);

-- =========================
-- 4. WEBHOOK DELIVERY LOG TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.form_submissions(id),
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  response_status INTEGER,
  response_body TEXT,
  delivered_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Select own webhook deliveries" ON public.webhook_deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own webhook delivery" ON public.webhook_deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own webhook delivery" ON public.webhook_deliveries FOR UPDATE USING (auth.uid() = user_id);

-- =========================
-- 5. DATA INTEGRITY (Foreign Key & Defaults)
-- =========================
-- Making sure all user-linked data references users by user_id column

-- =========================
-- 6. OPTIONAL: Add minimal constraints/validation
-- =========================
ALTER TABLE public.webhooks
  ADD CONSTRAINT url_not_empty CHECK (trim(url) <> ''),
  ADD CONSTRAINT name_not_empty CHECK (trim(name) <> '');

ALTER TABLE public.form_submission_rules
  ADD CONSTRAINT rule_name_not_empty CHECK (trim(name) <> '');

-- =========================
-- (End of migrations)
-- =========================
