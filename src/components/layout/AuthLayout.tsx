import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      <div className="w-full max-w-md px-4 z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Sisenco Digital</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">Workspace Authentication</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
