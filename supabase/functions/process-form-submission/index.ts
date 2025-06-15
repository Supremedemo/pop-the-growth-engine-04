
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormSubmissionRequest {
  campaignId?: string;
  templateId?: string;
  formData: Record<string, any>;
  userInfo?: Record<string, any>;
  websiteId?: string;
  trackedUserId?: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const evaluateConditions = (conditions: any, formData: any, userInfo: any): boolean => {
  // Evaluate field conditions
  if (conditions.field_conditions) {
    for (const [fieldPath, condition] of Object.entries(conditions.field_conditions)) {
      const fieldValue = getNestedValue(formData, fieldPath);
      if (!evaluateFieldCondition(fieldValue, condition)) {
        return false;
      }
    }
  }

  // Evaluate user conditions
  if (conditions.user_conditions) {
    for (const [key, expectedValue] of Object.entries(conditions.user_conditions)) {
      if (userInfo[key] !== expectedValue) {
        return false;
      }
    }
  }

  return true;
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const evaluateFieldCondition = (fieldValue: any, condition: any): boolean => {
  const { operator, value } = condition;

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).includes(String(value));
    case 'not_contains':
      return !String(fieldValue).includes(String(value));
    case 'starts_with':
      return String(fieldValue).startsWith(String(value));
    case 'ends_with':
      return String(fieldValue).endsWith(String(value));
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    case 'less_than':
      return Number(fieldValue) < Number(value);
    case 'is_empty':
      return !fieldValue || fieldValue === '';
    case 'is_not_empty':
      return fieldValue && fieldValue !== '';
    default:
      return false;
  }
};

const executeWebhookAction = async (action: any, formData: any, userInfo: any, webhookId: string, submissionId: string, ruleId: string) => {
  // Get webhook configuration
  const { data: webhook } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', webhookId)
    .eq('is_active', true)
    .single();

  if (!webhook) {
    console.log(`Webhook ${webhookId} not found or inactive`);
    return;
  }

  // Prepare payload
  let payload: any = {
    form_data: formData,
    user_info: userInfo,
    timestamp: new Date().toISOString(),
    submission_id: submissionId,
    rule_id: ruleId
  };

  // Filter fields if specified
  if (action.include_fields && Array.isArray(action.include_fields)) {
    const filteredData: any = {};
    action.include_fields.forEach((field: string) => {
      const value = getNestedValue(formData, field);
      if (value !== undefined) {
        filteredData[field] = value;
      }
    });
    payload.form_data = filteredData;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...webhook.headers
  };

  // Add authentication
  if (webhook.auth_type === 'bearer' && webhook.auth_config.token) {
    headers['Authorization'] = `Bearer ${webhook.auth_config.token}`;
  } else if (webhook.auth_type === 'basic' && webhook.auth_config.username && webhook.auth_config.password) {
    const credentials = btoa(`${webhook.auth_config.username}:${webhook.auth_config.password}`);
    headers['Authorization'] = `Basic ${credentials}`;
  } else if (webhook.auth_type === 'api_key' && webhook.auth_config.key && webhook.auth_config.header) {
    headers[webhook.auth_config.header] = webhook.auth_config.key;
  }

  // Create delivery record
  const { data: delivery } = await supabase
    .from('webhook_deliveries')
    .insert({
      webhook_id: webhookId,
      submission_id: submissionId,
      rule_id: ruleId,
      payload,
      delivery_status: 'pending'
    })
    .select()
    .single();

  if (!delivery) return;

  // Send webhook with delay if specified
  const delay = action.delay_seconds || 0;
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
  }

  try {
    const response = await fetch(webhook.url, {
      method: webhook.method,
      headers,
      body: JSON.stringify(payload),
    });

    const responseBody = await response.text();

    // Update delivery status
    await supabase
      .from('webhook_deliveries')
      .update({
        response_status: response.status,
        response_body: responseBody,
        delivery_status: response.ok ? 'success' : 'failed',
        delivered_at: new Date().toISOString(),
        attempts: 1
      })
      .eq('id', delivery.id);

  } catch (error) {
    // Update delivery with error
    await supabase
      .from('webhook_deliveries')
      .update({
        response_body: error.message,
        delivery_status: 'failed',
        attempts: 1
      })
      .eq('id', delivery.id);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, templateId, formData, userInfo = {}, websiteId, trackedUserId }: FormSubmissionRequest = await req.json();

    // Store form submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        campaign_id: campaignId || null,
        template_id: templateId || null,
        form_data: formData,
        user_info: userInfo,
        website_id: websiteId || null,
        tracked_user_id: trackedUserId || null,
      })
      .select()
      .single();

    if (submissionError || !submission) {
      throw new Error('Failed to store form submission');
    }

    // Get applicable rules
    let rulesQuery = supabase
      .from('form_submission_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (campaignId) {
      rulesQuery = rulesQuery.eq('campaign_id', campaignId);
    } else if (templateId) {
      rulesQuery = rulesQuery.eq('template_id', templateId);
    }

    const { data: rules } = await rulesQuery;

    if (!rules || rules.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'Form submission stored, no rules to process' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const processedRuleIds: string[] = [];

    // Process rules in priority order
    for (const rule of rules) {
      try {
        // Evaluate conditions
        if (evaluateConditions(rule.conditions, formData, userInfo)) {
          processedRuleIds.push(rule.id);

          // Execute actions
          if (rule.actions.webhooks && Array.isArray(rule.actions.webhooks)) {
            for (const webhookAction of rule.actions.webhooks) {
              await executeWebhookAction(
                webhookAction,
                formData,
                userInfo,
                webhookAction.webhook_id,
                submission.id,
                rule.id
              );
            }
          }

          // TODO: Add support for other action types (emails, notifications, etc.)
        }
      } catch (error) {
        console.error(`Error processing rule ${rule.id}:`, error);
      }
    }

    // Update submission with processed rules
    await supabase
      .from('form_submissions')
      .update({ processed_rules: processedRuleIds })
      .eq('id', submission.id);

    return new Response(
      JSON.stringify({
        success: true,
        submission_id: submission.id,
        processed_rules: processedRuleIds.length,
        message: 'Form submission processed successfully'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in process-form-submission function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
