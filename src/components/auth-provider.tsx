"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearSession,
  getSession,
  registerLocalUser,
  signInLocalUser,
  updateLocalProfile,
  type AuthUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Read browser storage after hydration so server and client start alike.
    queueMicrotask(() => {
      setUser(getSession());
      setReady(true);
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await signInLocalUser(email, password));
  }, []);
  const register = useCallback(async (name: string, email: string, password: string) => {
    setUser(await registerLocalUser(name, email, password));
  }, []);
  const updateProfile = useCallback((name: string) => {
    setUser((current) => current ? updateLocalProfile(current, name) : current);
  }, []);
  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, ready, signIn, register, updateProfile, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user && pathname !== "/login") router.replace("/login");
    if (ready && user && pathname === "/login") router.replace("/");
  }, [pathname, ready, router, user]);

  if (!ready || (!user && pathname !== "/login") || (user && pathname === "/login")) {
    return <div className="auth-loading">Loading EchoLens…</div>;
  }
  return <>{children}</>;
}
