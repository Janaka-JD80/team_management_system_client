import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { AiChatWidget } from '@/components/chat/AiChatWidget';

export function MainLayout() {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app we'd also call the backend logout endpoint
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold tracking-tight text-primary">Sisenco</h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <PermissionGuard allowedPermissions={['view:dashboard']}>
                <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </PermissionGuard>
              <PermissionGuard allowedPermissions={['view:own_reports']}>
                <Link to="/reports" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <FileText className="w-4 h-4" />
                  My Reports
                </Link>
              </PermissionGuard>
              <PermissionGuard allowedPermissions={['view:all_reports']}>
                <Link to="/team-reports" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Users className="w-4 h-4" />
                  Team Reports
                </Link>
              </PermissionGuard>
              {user?.roles.includes('admin') && (
                <Link to="/settings" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-mono hidden md:inline-block">
              {user?.user_email}
            </span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 relative">
        <Outlet />
      </main>

      {/* Render AI Chat Widget for users with Manager roles/permissions */}
      <PermissionGuard allowedPermissions={['view:all_reports']}>
        <AiChatWidget />
      </PermissionGuard>
    </div>
  );
}
