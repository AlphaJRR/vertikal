import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export type AvaProStatus = "loading" | "free" | "pro";

function tierIsPro(tier: string | null | undefined): boolean {
  if (!tier) return false;
  const normalized = tier.toLowerCase();
  return normalized === "pro";
}

/**
 * AVA Pro entitlement for the signed-in user.
 * Tri-state: loading | free | pro — never pro on error; null/missing profile = free.
 */
export function useAvaPro() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<AvaProStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function resolvePro() {
      if (authLoading) {
        if (!cancelled) setStatus("loading");
        return;
      }

      if (!user) {
        if (!cancelled) setStatus("free");
        return;
      }

      if (!cancelled) setStatus("loading");

      try {
        if (!supabase?.auth) {
          if (!cancelled) setStatus("free");
          return;
        }

        const meta =
          user.user_metadata?.subscription_tier ??
          user.app_metadata?.subscription_tier;
        if (tierIsPro(typeof meta === "string" ? meta : undefined)) {
          if (!cancelled) setStatus("pro");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("[useAvaPro] profiles lookup failed:", error);
          if (!cancelled) setStatus("free");
          return;
        }

        if (!cancelled) {
          setStatus(tierIsPro(profile?.subscription_tier) ? "pro" : "free");
        }
      } catch (error) {
        console.error("[useAvaPro] resolvePro failed:", error);
        if (!cancelled) setStatus("free");
      }
    }

    void resolvePro();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      void resolvePro();
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [user, authLoading]);

  const isPro = status === "pro";
  const loading = status === "loading" || authLoading;
  const isSignedIn = Boolean(user);
  const userEmail = user?.email ?? null;

  return {
    status,
    isPro,
    loading,
    isSignedIn,
    userEmail,
  };
}
