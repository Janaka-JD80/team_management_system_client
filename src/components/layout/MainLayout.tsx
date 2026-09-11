import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, LayoutDashboard, FileText } from 'lucide-react';

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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold tracking-tight">Sisenco</h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
              <a href="/reports" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
                <FileText className="w-4 h-4" />
                Reports
              </a>
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

      <main className="flex-1 container mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
