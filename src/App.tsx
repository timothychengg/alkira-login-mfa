import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Mfa from './pages/Mfa';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './state/AuthContext';

export default function App() {
  const { user, signOut } = useAuth();
  return (
    <div className='min-h-screen'>
      <header className='sticky top-0 z-10 bg-white/90 backdrop-blur border-b'>
        <div className='mx-auto max-w-5xl p-4 flex items-center gap-4 justify-between'>
          <Link to='/' className='font-bold'>
            Alkira Demo
          </Link>
          <nav className='flex items-center gap-4 text-sm'>
            {user && (
              <>
                <span className='badge'>
                  Signed in as {user.email} ({user.role})
                </span>
                <button className='button' onClick={signOut}>
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className='mx-auto max-w-5xl p-4'>
        <Routes>
          <Route
            path='/'
            element={<Navigate to={user ? '/app' : '/login'} />}
          />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/mfa' element={<Mfa />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/app' element={<Dashboard />} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </main>
    </div>
  );
}
