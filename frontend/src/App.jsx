import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AddUser from './pages/admin/AddUser.jsx';
import UserDetail from './pages/admin/UserDetail.jsx';
import AdminStores from './pages/admin/AdminStores.jsx';

import StoreList from './pages/user/StoreList.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';

const roleHome = { ADMIN: '/admin', USER: '/stores', STORE_OWNER: '/owner' };

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role] || '/login'} replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/update-password" element={
          <ProtectedRoute><UpdatePassword /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/users/new" element={
          <ProtectedRoute roles={['ADMIN']}><AddUser /></ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute roles={['ADMIN']}><UserDetail /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['ADMIN']}><AdminStores /></ProtectedRoute>
        } />

        <Route path="/stores" element={
          <ProtectedRoute roles={['USER']}><StoreList /></ProtectedRoute>
        } />

        <Route path="/owner" element={
          <ProtectedRoute roles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}
