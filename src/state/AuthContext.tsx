import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '../services/mockApi';

type User = { email: string; role: api.Role } | null;

type Ctx = {
  user: User;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, role?: api.Role) => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ requiresMfa: boolean }>;
  verifyMfaCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    (async () => {
      const sess = await api.currentSession();
      if (sess) setUser({ email: sess.email, role: sess.role });
      setBooted(true);
    })();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      user,
      isAuthenticated: !!user,
      signUp: async (email, password, role) => {
        await api.signup(email, password, role);
      },
      signIn: async (email, password) => {
        const res = await api.login(email, password);
        return { requiresMfa: !!res.requiresMfa };
      },
      verifyMfaCode: async (code) => {
        const sess = await api.verifyMfa(code);
        setUser({ email: sess.email, role: sess.role });
      },
      signOut: async () => {
        await api.signout();
        setUser(null);
      },
    }),
    [user]
  );

  if (!booted) return <div className='p-8'>Booting…</div>;

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('AuthContext missing');
  return ctx;
}
