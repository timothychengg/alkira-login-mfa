import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);
const SESSION_KEY = 'auth_session_v2';

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null, 
    accessToken: null, 
    tempLoginToken: null,
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const beginLogin = (user, tempLoginToken) =>
    setState({ user, tempLoginToken, accessToken: null });

  const finalizeMfa = (accessToken) =>
    setState((s) => ({ ...s, accessToken, tempLoginToken: null }));

  const signOut = () =>
    setState({ user: null, accessToken: null, tempLoginToken: null });

  const value = useMemo(
    () => ({
      ...state,
      beginLogin,
      finalizeMfa,
      signOut,
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
