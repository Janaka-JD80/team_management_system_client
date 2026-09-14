import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, FileText, Users, Settings, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { AiChatWidget } from '@/components/chat/AiChatWidget';

export function MainLayout() {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <h1 className="text-xl font-semibold tracking-tight text-primary">TMS</h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <PermissionGuard allowedPermissions={['view:dashboard']}>
                <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
              </PermissionGuard>
              <PermissionGuard allowedPermissions={['view:own_reports']}>
                <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  <FileText className="w-4 h-4" />
                  My Reports
                </NavLink>
              </PermissionGuard>
              <PermissionGuard allowedPermissions={['view:all_reports']}>
                <NavLink to="/team-reports" className={({ isActive }) => `flex items-center gap-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Users className="w-4 h-4" />
                  Team Reports
                </NavLink>
              </PermissionGuard>
              {user?.roles.includes('admin') && (
                <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-2 transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Settings className="w-4 h-4" />
                  Settings
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-mono hidden md:inline-block">
              {user?.user_email}
            </span>
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-secondary/80 text-muted-foreground hover:text-foreground outline-none">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-left text-primary tracking-tight font-semibold">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2">
                    <PermissionGuard allowedPermissions={['view:dashboard']}>
                      <NavLink 
                        to="/dashboard" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                      </NavLink>
                    </PermissionGuard>
                    <PermissionGuard allowedPermissions={['view:own_reports']}>
                      <NavLink 
                        to="/reports" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <FileText className="w-5 h-5" /> My Reports
                      </NavLink>
                    </PermissionGuard>
                    <PermissionGuard allowedPermissions={['view:all_reports']}>
                      <NavLink 
                        to="/team-reports" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <Users className="w-5 h-5" /> Team Reports
                      </NavLink>
                    </PermissionGuard>
                    {user?.roles.includes('admin') && (
                      <NavLink 
                        to="/settings" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary font-semibold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <Settings className="w-5 h-5" /> Settings
                      </NavLink>
                    )}
                    
                    <div className="h-px bg-border my-2"></div>
                    
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 p-3 rounded-md transition-colors text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground hidden md:flex"
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
