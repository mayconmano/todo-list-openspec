import { useAuth } from '@/hooks/useAuth';
import { useTodoStats } from '@/hooks/useTodoStats';

function StatCard({ label, value, isLoading }: { label: string; value: number; isLoading: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      {isLoading ? (
        <div className="h-8 w-16 rounded bg-muted animate-pulse" />
      ) : (
        <span className="text-3xl font-bold tabular-nums">{value}</span>
      )}
    </div>
  );
}

export function HomePage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useTodoStats();

  const displayName = user?.name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="px-4 pt-16 pb-8 md:pt-8 md:px-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">
        Olá, {displayName} 👋
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Aqui estão suas tarefas desta semana.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats?.total ?? 0} isLoading={isLoading} />
        <StatCard label="Pendentes" value={stats?.pending ?? 0} isLoading={isLoading} />
        <StatCard label="Concluídas" value={stats?.completed ?? 0} isLoading={isLoading} />
      </div>
    </div>
  );
}
