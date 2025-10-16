import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);
const LS_KEY = 'session';

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null, // { id, email, role }
    accessToken: null, // set after MFA success
    tempLoginToken: null, // set after password login before MFA
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      setTempLoginToken: (t) => setState((s) => ({ ...s, tempLoginToken: t })),
      signIn: (user, accessToken) =>
        setState({ user, accessToken, tempLoginToken: null }),
      signOut: () =>
        setState({ user: null, accessToken: null, tempLoginToken: null }),
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
