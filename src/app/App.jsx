import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Mfa from '../pages/Mfa';
import NotFound from '../pages/NotFound';
import ProtectedApp from '../pages/ProtectedApp';
import ProtectedRoute from '../auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/mfa' element={<Mfa />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/app' element={<ProtectedApp />} />
          </Route>
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
