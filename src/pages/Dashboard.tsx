import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground font-mono">
          Welcome back, {user?.full_name || user?.user_email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight mb-2">Weekly Report Status</h3>
          <p className="text-sm text-muted-foreground">You have not submitted a report for this week.</p>
        </div>
        
        {user?.roles.includes('manager') && (
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-2">Pending Reviews</h3>
            <p className="text-sm text-muted-foreground">2 reports need your attention.</p>
          </div>
        )}
      </div>
    </div>
  );
}
