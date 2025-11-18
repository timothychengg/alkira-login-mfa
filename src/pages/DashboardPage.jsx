import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { session, userRole, setIsMfaVerified } = useAuth();
  const navigate = useNavigate();

  const email = session?.user?.email ?? `Unknown User`;
  const isReadWrite = userRole === 'readwrite';

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMfaVerified(false);
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      <p>
        Signed in as: <strong>{email}</strong>
      </p>

      <p>
        Role: <strong>{userRole || 'readonly'}</strong>
      </p>

      <hr />

      {isReadWrite ? (
        <div>
          <h2>Write Access Enabled</h2>
          <p>You have permissions to perform write operations.</p>
          <button>Simulate Write Action</button>
        </div>
      ) : (
        <div>
          <h2>Read-Only Mode</h2>
          <p>You cannot modify data with this account.</p>
        </div>
      )}

      <hr style={{ marginTop: '20px' }} />

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
