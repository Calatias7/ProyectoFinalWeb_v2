import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SenderDuca from './pages/SenderDuca.jsx';

function RequireAuth({ children }){
  const token = localStorage.getItem('token');
  const location = useLocation();
  if(!token){
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
      <Route path="/sender" element={
        <RequireAuth>
          <RoleOnly role="IMPORTADOR">
            <SenderDuca />
          </RoleOnly>
        </RequireAuth>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function HomeRedirect(){
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if(!token) return <Navigate to="/login" replace/>;
  if(role === 'IMPORTADOR') return <Navigate to="/sender" replace/>;
  return <Navigate to="/dashboard" replace/>;
}

function RoleOnly({ role, children }){
  const r = localStorage.getItem('role');
  if(r !== role) return <Navigate to="/dashboard" replace/>;
  return children;
}
