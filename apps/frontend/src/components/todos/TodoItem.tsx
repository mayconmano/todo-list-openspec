import { useState } from 'react';
import type { Todo } from '../../hooks/useTodos';
import { useUpdateTodo } from '../../hooks/useUpdateTodo';
import { useDeleteTodo } from '../../hooks/useDeleteTodo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/Checkbox';
import { cn } from '@/lib/utils';

interface Props {
  todo: Todo;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
      <path
        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.609Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
      <path
        d="M6.5 1.75a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25V3h-3V1.75ZM5 3V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75V3h2.25a.75.75 0 0 1 0 1.5H13v8.25A2.25 2.25 0 0 1 10.75 15h-5.5A2.25 2.25 0 0 1 3 12.75V4.5h-.25a.75.75 0 0 1 0-1.5H5Zm1.5 3.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Zm3.5 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TodoItem({ todo }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? '');
  const [editDueDate, setEditDueDate] = useState(todo.due_date ?? '');

  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  function handleToggle() {
    updateTodo({ id: todo.id, completed: !todo.completed });
  }

  function handleEdit() {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? '');
    setEditDueDate(todo.due_date ?? '');
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleSave() {
    if (!editTitle.trim()) return;
    updateTodo(
      {
        id: todo.id,
        title: editTitle.trim(),
        description: editDescription || null,
        due_date: editDueDate || null,
      },
      { onSuccess: () => setEditing(false) },
    );
  }

  function handleDelete() {
    if (window.confirm(`Deletar "${todo.title}"?`)) {
      deleteTodo(todo.id);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Título"
          disabled={isUpdating}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          disabled={isUpdating}
          rows={2}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-none"
        />
        <Input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          disabled={isUpdating}
          className="w-40"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isUpdating || !editTitle.trim()}>
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUpdating}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-lg border border-border bg-card p-3',
        'transition-all duration-150 hover:translate-x-0.5 hover:bg-accent/30',
        todo.completed && 'opacity-50',
      )}
    >
      <div className="mt-0.5">
        <Checkbox
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isUpdating}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium transition-all duration-200',
            todo.completed && 'line-through text-muted-foreground',
          )}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{todo.description}</p>
        )}
        {todo.due_date && (
          <p className="mt-0.5 text-xs text-muted-foreground">📅 {formatDate(todo.due_date)}</p>
        )}
      </div>
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleEdit}
          disabled={isDeleting}
          title="Editar"
          className="h-7 w-7 text-muted-foreground hover:text-primary"
        >
          <PencilIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Deletar"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
