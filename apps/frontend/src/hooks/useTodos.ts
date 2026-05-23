import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFilters {
  search?: string;
  status?: 'all' | 'pending' | 'completed';
  due_date_from?: string;
  due_date_to?: string;
  due_date_preset?: string;
}

interface TodosPage {
  data: Todo[];
  total: number;
  page: number;
  totalPages: number;
}

export function useTodos(filters: TodoFilters = {}) {
  return useInfiniteQuery<TodosPage>({
    queryKey: ['todos', filters],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filters.search) params.set('search', filters.search);
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.due_date_from) params.set('due_date_from', filters.due_date_from);
      if (filters.due_date_to) params.set('due_date_to', filters.due_date_to);
      if (filters.due_date_preset) params.set('due_date_preset', filters.due_date_preset);
      const res = await apiFetch(`/todos?${params}`);
      if (!res.ok) throw new Error('Failed to fetch todos');
      return res.json() as Promise<TodosPage>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
