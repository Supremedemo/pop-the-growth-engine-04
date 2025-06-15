
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookTestRequest {
  webhookId: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhookId }: WebhookTestRequest = await req.json();

    // Get webhook configuration
    const { data: webhook, error: webhookError } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (webhookError || !webhook) {
      throw new Error('Webhook not found');
    }

    // Prepare test payload
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      message: "This is a test webhook delivery",
      form_data: {
        email: "test@example.com",
        name: "Test User",
        message: "Test message"
      }
    };

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...webhook.headers
    };

    // Add authentication if configured
    if (webhook.auth_type === 'bearer' && webhook.auth_config.token) {
      headers['Authorization'] = `Bearer ${webhook.auth_config.token}`;
    } else if (webhook.auth_type === 'basic' && webhook.auth_config.username && webhook.auth_config.password) {
      const credentials = btoa(`${webhook.auth_config.username}:${webhook.auth_config.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    } else if (webhook.auth_type === 'api_key' && webhook.auth_config.key && webhook.auth_config.header) {
      headers[webhook.auth_config.header] = webhook.auth_config.key;
    }

    // Send test request
    const startTime = Date.now();
    let testStatus = 'failed';
    let responseBody = '';
    let responseStatus = 0;

    try {
      const response = await fetch(webhook.url, {
        method: webhook.method,
        headers,
        body: JSON.stringify(testPayload),
      });

      responseStatus = response.status;
      responseBody = await response.text();
      testStatus = response.ok ? 'success' : 'failed';
    } catch (error) {
      responseBody = error.message;
      testStatus = 'failed';
    }

    const duration = Date.now() - startTime;

    // Update webhook with test results
    await supabase
      .from('webhooks')
      .update({
        last_tested_at: new Date().toISOString(),
        last_test_status: testStatus,
        last_test_response: `${responseStatus}: ${responseBody.substring(0, 500)}`,
      })
      .eq('id', webhookId);

    return new Response(
      JSON.stringify({
        success: testStatus === 'success',
        status: responseStatus,
        response: responseBody,
        duration,
        message: testStatus === 'success' ? 'Webhook test successful!' : 'Webhook test failed'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in test-webhook function:", error);
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
