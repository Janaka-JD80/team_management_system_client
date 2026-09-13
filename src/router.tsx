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
import SettingsLayout from '@/pages/settings/SettingsLayout';
import { useAuthStore } from '@/store/authStore';
import { AdminRoute } from '@/components/auth/AdminRoute';

const IndexRoute = () => {
  const { user } = useAuthStore();
  if (user?.roles.includes('manager')) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/reports" replace />;
};

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
      { path: 'settings', element: <AdminRoute><SettingsLayout /></AdminRoute> },
      { index: true, element: <IndexRoute /> }
    ],
  },
]);
