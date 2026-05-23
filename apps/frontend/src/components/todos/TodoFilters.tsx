import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TodoFilters } from '../../hooks/useTodos';

interface Props {
  onChange: (filters: TodoFilters) => void;
}

type DatePreset = 'all' | 'today' | 'this_week' | 'overdue' | 'no_due_date';
type StatusFilter = 'all' | 'pending' | 'completed';

function getPresetRange(preset: DatePreset): { from: string; to: string; special?: string } {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = fmt(today);

  switch (preset) {
    case 'today':
      return { from: todayStr, to: todayStr };
    case 'this_week': {
      const day = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((day + 6) % 7));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { from: fmt(monday), to: fmt(sunday) };
    }
    case 'overdue': {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return { from: '', to: fmt(yesterday) };
    }
    case 'no_due_date':
      return { from: '', to: '', special: 'no_due_date' };
    default:
      return { from: '', to: '' };
  }
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
];

const presetOptions: { value: DatePreset; label: string }[] = [
  { value: 'all', label: 'Qualquer prazo' },
  { value: 'today', label: 'Hoje' },
  { value: 'this_week', label: 'Esta semana' },
  { value: 'overdue', label: 'Atrasados' },
  { value: 'no_due_date', label: 'Sem prazo' },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 px-3 rounded-full text-xs font-medium border transition-all duration-150',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export function TodoFilters({ onChange }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [preset, setPreset] = useState<DatePreset>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const filters: TodoFilters = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (status !== 'all') filters.status = status;
    if (preset === 'no_due_date') {
      filters.due_date_preset = 'no_due_date';
    } else {
      if (dateFrom) filters.due_date_from = dateFrom;
      if (dateTo) filters.due_date_to = dateTo;
    }
    onChange(filters);
  }, [debouncedSearch, status, preset, dateFrom, dateTo, onChange]);

  function handlePresetChange(value: DatePreset) {
    setPreset(value);
    if (value === 'all') {
      setDateFrom('');
      setDateTo('');
    } else if (value !== 'no_due_date') {
      const range = getPresetRange(value);
      setDateFrom(range.from);
      setDateTo(range.to);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por título..."
        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="flex flex-wrap gap-1.5">
        {statusOptions.map((opt) => (
          <Pill key={opt.value} active={status === opt.value} onClick={() => setStatus(opt.value)}>
            {opt.label}
          </Pill>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        {presetOptions.map((opt) => (
          <Pill
            key={opt.value}
            active={preset === opt.value}
            onClick={() => handlePresetChange(opt.value)}
          >
            {opt.label}
          </Pill>
        ))}

        {preset === 'all' && (
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPreset('all'); }}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:border-primary"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPreset('all'); }}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
