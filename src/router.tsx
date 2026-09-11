import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { index: true, element: <Navigate to="/dashboard" replace /> }
    ],
  },
]);
