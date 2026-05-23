import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTodos, type TodoFilters } from '../hooks/useTodos';
import { useAuth } from '../hooks/useAuth';
import { CreateTodoForm } from '../components/todos/CreateTodoForm';
import { TodoFilters as TodoFiltersComponent } from '../components/todos/TodoFilters';
import { TodoList } from '../components/todos/TodoList';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function TodosPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    queryClient.clear();
  }

  const [filters, setFilters] = useState<TodoFilters>({});

  const handleFiltersChange = useCallback((newFilters: TodoFilters) => {
    setFilters(newFilters);
  }, []);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useTodos(filters);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight">✦ Todo</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
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
    </main>
  );
}
