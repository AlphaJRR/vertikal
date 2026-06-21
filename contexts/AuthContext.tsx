import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (!supabase?.auth) {
          if (!cancelled) setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthContext] getSession failed:", error);
        }
        if (!cancelled) {
          setSession(data.session ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("[AuthContext] init failed:", error);
        if (!cancelled) setLoading(false);
      }
    }

    void init();

    if (!supabase?.auth) {
      return () => {
        cancelled = true;
      };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!cancelled) {
          setSession(nextSession);
          setLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase?.auth) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthContext] signOut failed:", error);
        throw error;
      }
    } catch (error) {
      console.error("[AuthContext] signOut failed:", error);
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut,
    }),
    [session, loading, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
