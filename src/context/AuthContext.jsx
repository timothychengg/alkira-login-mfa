import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isMfaVerified, setIsMfaVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session from Supabase:', error);
        setLoading(false);
        return;
      }

      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user) {
        const role = currentSession.user.user_metadata?.role ?? 'readonly';
        setUserRole(role);
      }

      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);

      if (newSession?.user) {
        const role = newSession.user.user_metadata?.role ?? 'readonly';
        setUserRole(role);
      } else {
        setUserRole(null);
        setIsMfaVerified(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    userRole,
    isMfaVerified,
    setIsMfaVerified,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
