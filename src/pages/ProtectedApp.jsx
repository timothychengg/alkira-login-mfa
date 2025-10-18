import React from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ProtectedApp() {
  const { user, signOut } = useAuth();
  const canEdit = user?.role === 'readWrite';

  return (
    <div className='container'>
      <h1>Welcome, {user?.email}</h1>
      <p>
        Access level: <b>{user?.role}</b>
      </p>

      <div style={{ marginTop: 16 }}>
        <h2>Items</h2>
        <ul>
          <li>Example Item</li>
          <li>Example Item</li>
        </ul>
        {canEdit && (
          <div className='actions'>
            <button>Add Item</button>
            <button>Edit Selected</button>
          </div>
        )}
      </div>

      <div className='actions' style={{ marginTop: 16 }}>
        <button onClick={signOut}>Sign out</button>
      </div>
    </div>
  );
}
