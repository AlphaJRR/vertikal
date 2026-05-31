import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Returns whether the signed-in user has AVA Pro (Creator Toolkit Pro tier).
 * Checks Supabase auth user_metadata / app_metadata first, then profiles.subscription_tier.
 */
export function useAvaPro() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkPro() {
      try {
        if (!supabase?.auth) {
          if (!cancelled) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        const meta =
          user.user_metadata?.subscription_tier ??
          user.app_metadata?.subscription_tier;
        if (meta === "pro" || meta === "PRO") {
          if (!cancelled) {
            setIsPro(true);
            setLoading(false);
          }
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();

        if (!cancelled) {
          setIsPro(profile?.subscription_tier === "pro");
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setIsPro(false);
          setLoading(false);
        }
      }
    }

    checkPro();

    const sub = supabase?.auth?.onAuthStateChange?.(() => {
      checkPro();
    });

    return () => {
      cancelled = true;
      sub?.data?.subscription?.unsubscribe();
    };
  }, []);

  return { isPro, loading };
}
