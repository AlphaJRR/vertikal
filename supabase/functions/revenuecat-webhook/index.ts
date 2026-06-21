/**
 * revenuecat-webhook edge function
 *
 * Syncs RevenueCat subscription events to profiles.subscription_tier.
 * Configure webhook URL in RevenueCat dashboard → Project → Integrations → Webhooks.
 *
 * Secrets (Supabase Edge Function):
 *   REVENUECAT_WEBHOOK_SECRET — Authorization bearer token (set in RC webhook config)
 *   SUPABASE_SERVICE_ROLE_KEY — auto-injected
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const PRO_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "NON_RENEWING_PURCHASE",
  "SUBSCRIPTION_EXTENDED",
]);

const FREE_EVENTS = new Set(["EXPIRATION", "CANCELLATION"]);

type RevenueCatEvent = {
  type?: string;
  app_user_id?: string;
};

type RevenueCatPayload = {
  event?: RevenueCatEvent;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors() });
  }

  if (req.method !== "POST") {
    return err("Method not allowed", 405);
  }

  if (!verifyWebhookAuth(req)) {
    return err("Unauthorized", 401);
  }

  let payload: RevenueCatPayload;
  try {
    payload = await req.json();
  } catch {
    return err("Invalid JSON", 400);
  }

  const event = payload.event;
  if (!event?.type || !event.app_user_id) {
    return err("Missing event type or app_user_id", 400);
  }

  const userId = event.app_user_id;
  if (!isUuid(userId)) {
    console.warn("[revenuecat-webhook] non-uuid app_user_id:", userId);
    return json({ ok: true, skipped: "non_uuid_app_user_id" });
  }

  let tier: "pro" | "free" | null = null;
  if (PRO_EVENTS.has(event.type)) {
    tier = "pro";
  } else if (FREE_EVENTS.has(event.type)) {
    tier = "free";
  }

  if (!tier) {
    return json({ ok: true, skipped: event.type });
  }

  try {
    const { error } = await admin
      .from("profiles")
      .update({ subscription_tier: tier })
      .eq("id", userId);

    if (error) {
      console.error("[revenuecat-webhook] profile update failed:", error);
      return err("Profile update failed", 500);
    }

    console.log(
      `[revenuecat-webhook] ${event.type} → subscription_tier=${tier} user=${userId}`,
    );
    return json({ ok: true, tier, event: event.type });
  } catch (e) {
    console.error("[revenuecat-webhook]", e);
    return err("Internal server error", 500);
  }
});

function verifyWebhookAuth(req: Request): boolean {
  if (!WEBHOOK_SECRET) {
    console.error("[revenuecat-webhook] REVENUECAT_WEBHOOK_SECRET not set");
    return false;
  }
  const auth = req.headers.get("Authorization");
  return auth === `Bearer ${WEBHOOK_SECRET}`;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(), "Content-Type": "application/json" },
  });
}

function err(message: string, status: number) {
  return json({ error: message }, status);
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}
