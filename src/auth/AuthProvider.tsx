// src/auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { ensureUserProfile } from "../lib/db/userProfile";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, loginWithGoogle: async () => {}, logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        try { await ensureUserProfile(u); } catch {}
      }
    });
  }, []);

  const loginWithGoogle = async () => { await signInWithPopup(auth, googleProvider); };
  const logout = async () => { await signOut(auth); };

  const value = useMemo(() => ({ user, loading, loginWithGoogle, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
