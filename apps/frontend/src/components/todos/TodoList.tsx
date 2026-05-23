import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { InfiniteData } from '@tanstack/react-query';
import type { Todo } from '../../hooks/useTodos';
import { TodoItem } from './TodoItem';

interface TodosPage {
  data: Todo[];
  total: number;
  page: number;
  totalPages: number;
}

interface Props {
  data: InfiniteData<TodosPage> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function TodoList({ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>;
  }

  const todos = data?.pages.flatMap((page) => page.data) ?? [];

  if (todos.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhuma tarefa encontrada.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <TodoItem todo={todo} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <p className="text-sm text-muted-foreground text-center py-2">Carregando mais...</p>
      )}
    </div>
  );
}
