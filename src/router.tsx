import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';

import ReportHistory from '@/pages/reports/ReportHistory';
import ReportEditor from '@/pages/reports/ReportEditor';
import ReportDetail from '@/pages/reports/ReportDetail';
import ManagerDashboard from '@/pages/reports/ManagerDashboard';

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
      { path: 'team-reports', element: <ManagerDashboard /> },
      { path: 'reports', element: <ReportHistory /> },
      { path: 'reports/:id/edit', element: <ReportEditor /> },
      { path: 'reports/:id/view', element: <ReportDetail /> },
      { path: 'reports/new', element: <ReportEditor /> },
      { index: true, element: <Navigate to="/dashboard" replace /> }
    ],
  },
]);
