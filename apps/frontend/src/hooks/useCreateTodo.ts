import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import type { Todo } from './useTodos';

interface CreateTodoInput {
  title: string;
  description?: string;
  due_date?: string;
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTodoInput): Promise<Todo> => {
      const res = await apiFetch('/todos', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'Failed to create todo');
      }
      const data = await res.json() as { todo: Todo };
      return data.todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
