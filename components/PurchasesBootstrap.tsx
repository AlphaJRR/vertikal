import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Initializes RevenueCat when a Supabase session exists.
 * Only mounted when FREE_LAUNCH is false (see app/_layout.tsx).
 * Lazy-loads lib/purchases so pre-native builds never require react-native-purchases at boot.
 */
export function PurchasesBootstrap() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    void (async () => {
      const { initPurchases, logOutPurchases } = await import("../lib/purchases");

      if (user?.id) {
        await initPurchases(user.id);
        return;
      }

      await logOutPurchases();
    })();
  }, [user?.id, loading]);

  return null;
}
