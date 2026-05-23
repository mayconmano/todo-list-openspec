import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface TodoStats {
  total: number;
  pending: number;
  completed: number;
}

export function useTodoStats() {
  return useQuery<TodoStats>({
    queryKey: ['todo-stats'],
    queryFn: async () => {
      const res = await apiFetch('/todos/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });
}
