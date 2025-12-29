import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // HARD CAP — FOUNDING 50
    const { count } = await supabase
      .from("auth.users")
      .select("*", { count: "exact", head: true });

    if (count && count >= 50) {
      return new Response(
        JSON.stringify({ error: "Founding 50 is full" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // UNIQUE REFERRAL CODE
    const referral = crypto.randomUUID().slice(0, 8).toUpperCase();

    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: false,
      user_metadata: {
        first_name: body.firstName,
        last_name: body.lastName,
        username: body.username,
        referral_code: referral,
        referred_by: body.referralCode || null,
        role: "creator",
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // ZAPIER LOG
    const zapierUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierUrl) {
      try {
        await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: body.email,
            user_id: data.user.id,
            role: "creator",
            referral_code: referral,
            source: "creators.vertikalapp.com",
          }),
        });
      } catch (zapierError) {
        // Log but don't fail signup if Zapier is down
        console.error("Zapier error:", zapierError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, referral }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

