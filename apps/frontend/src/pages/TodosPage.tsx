import { useState, useCallback } from 'react';
import { useTodos, type TodoFilters } from '../hooks/useTodos';
import { CreateTodoForm } from '../components/todos/CreateTodoForm';
import { TodoFilters as TodoFiltersComponent } from '../components/todos/TodoFilters';
import { TodoList } from '../components/todos/TodoList';

export function TodosPage() {
  const [filters, setFilters] = useState<TodoFilters>({});

  const handleFiltersChange = useCallback((newFilters: TodoFilters) => {
    setFilters(newFilters);
  }, []);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useTodos(filters);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-6 md:pt-6 space-y-4">
      <CreateTodoForm />
      <TodoFiltersComponent onChange={handleFiltersChange} />
      <TodoList
        data={data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
