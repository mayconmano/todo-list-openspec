import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCreateTodo } from '../../hooks/useCreateTodo';

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateTodoForm() {
  const { mutateAsync, isPending } = useCreateTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await mutateAsync({
      title: values.title,
      description: values.description || undefined,
      due_date: values.due_date || undefined,
    });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            {...register('title')}
            placeholder="Adicionar nova tarefa..."
            disabled={isPending}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <Input
          {...register('due_date')}
          type="date"
          disabled={isPending}
          className="w-36"
        />
        <Button type="submit" disabled={isPending} className="shrink-0">
          {isPending ? '...' : '+ Add'}
        </Button>
      </div>
      <textarea
        {...register('description')}
        placeholder="Descrição (opcional)"
        disabled={isPending}
        rows={2}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-none"
      />
    </form>
  );
}
