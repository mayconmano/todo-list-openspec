import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth } from '../../middleware/withAuth';
import { json } from '../../lib/response';

export const handler = withAuth(async (event) => {
  let body: { title?: unknown; description?: unknown; due_date?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { title, description, due_date } = body;

  if (typeof title !== 'string' || title.trim() === '') {
    return json(400, { error: 'title is required' });
  }

  const userId = event.user.sub;

  const result = await db.insert(schema.todos).values({
    user_id: userId,
    title: title.trim(),
    description: typeof description === 'string' ? description : null,
    due_date: typeof due_date === 'string' && due_date ? new Date(due_date) : null,
    completed: false,
  });

  const [todo] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, result[0].insertId));

  return json(201, { todo });
});
