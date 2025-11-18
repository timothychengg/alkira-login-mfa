import { useState } from 'react';
import { useAuth } from '../state/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<string[]>(['First note']);
  const [input, setInput] = useState('');

  const canEdit = user?.role === 'readWrite';

  function addNote() {
    if (!canEdit) return;
    if (input.trim()) {
      setNotes((n) => [input.trim(), ...n]);
      setInput('');
    }
  }

  return (
    <div className='grid md:grid-cols-2 gap-6 mt-6'>
      <div className='card'>
        <h2 className='text-lg font-semibold mb-2'>Protected Area</h2>
        <p className='helper'>
          You can only see this after successful login <em>and</em> MFA.
        </p>
        <p className='mt-4'>
          <span className='badge'>role: {user?.role}</span>
        </p>
      </div>

      <div className='card'>
        <div className='toolbar mb-3'>
          <h3 className='font-semibold'>Demo Notes</h3>
          {!canEdit && <span className='badge'>readOnly</span>}
          {canEdit && <span className='badge'>readWrite</span>}
        </div>
        <div className='flex gap-2'>
          <input
            className='input'
            placeholder={
              canEdit ? 'Write a note…' : 'Read‑only users cannot add notes'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!canEdit}
          />
          <button className='button' onClick={addNote} disabled={!canEdit}>
            Add
          </button>
        </div>
        <ul className='mt-4 space-y-2'>
          {notes.map((n, i) => (
            <li key={i} className='rounded-xl border p-2 bg-slate-50'>
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
