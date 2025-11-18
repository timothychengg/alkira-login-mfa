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
    <div className='dashboard-layout'>
      <div className='dashboard-grid'>
        <div className='auth-card stat-card'>
          <div className='card-accent' />
          <p className='eyebrow'>Session</p>
          <h1>Alkira Control Portal</h1>
          <div className='stat-value'>{email}</div>
          <p className='stat-label'>Signed in user</p>
          <div className='badge'>
            <span aria-hidden='true'>🔐</span> MFA verified
          </div>
        </div>

        <div className='auth-card stat-card'>
          <div className='card-accent' />
          <p className='eyebrow'>Access tier</p>
          <h2>{isReadWrite ? 'Read/Write Access' : 'Read-only Mode'}</h2>
          <div className='stat-value'>{userRole || 'readonly'}</div>
          <p className='subtitle'>
            {isReadWrite
              ? 'You can perform simulated write actions within the demo.'
              : 'Write operations are disabled for this session.'}
          </p>
          <div className='action-row'>
            {isReadWrite ? (
              <button className='primary-btn'>Simulate Write Action</button>
            ) : (
              <button className='secondary-btn' disabled>
                Write locked
              </button>
            )}
            <button className='secondary-btn' onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <div className='info-card'>
          <div className='card-accent' />
          <p className='eyebrow'>Deployment notes</p>
          <h3>Operational highlights</h3>
          <ul className='list-muted'>
            <li>Demonstrates Alkira-style MFA gating prior to dashboard access.</li>
            <li>Role metadata from Supabase informs UI copy and access hints.</li>
            <li>Use the logout button to reset the MFA state for testing.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
