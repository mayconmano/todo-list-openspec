import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import type { Todo } from './useTodos';

interface UpdateTodoInput {
  id: number;
  title?: string;
  description?: string | null;
  completed?: boolean;
  due_date?: string | null;
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTodoInput): Promise<Todo> => {
      const res = await apiFetch(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'Failed to update todo');
      }
      const data = await res.json() as { todo: Todo };
      return data.todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
