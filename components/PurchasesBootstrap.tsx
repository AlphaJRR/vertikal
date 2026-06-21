import { useEffect } from "react";
import { FREE_LAUNCH } from "../constants/proAccess";
import { useAuth } from "../contexts/AuthContext";
import { initPurchases, logOutPurchases } from "../lib/purchases";

/**
 * Initializes RevenueCat when a Supabase session exists.
 * No-op while FREE_LAUNCH is true (App Review / free period).
 */
export function PurchasesBootstrap() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (FREE_LAUNCH || loading) return;

    if (user?.id) {
      void initPurchases(user.id);
      return;
    }

    void logOutPurchases();
  }, [user?.id, loading]);

  return null;
}
