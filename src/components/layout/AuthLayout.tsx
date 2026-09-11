import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden relative">
      {/* Abstract background blobs for Next Level UI vibe */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#6366F1]/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Sisenco Digital</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">Workspace Authentication</p>
        </div>
        
        <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl shadow-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
