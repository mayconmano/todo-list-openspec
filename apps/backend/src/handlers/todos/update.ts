import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth } from '../../middleware/withAuth';
import { json } from '../../lib/response';

export const handler = withAuth(async (event) => {
  const id = parseInt(event.pathParameters?.['id'] ?? '', 10);
  if (!id) return json(404, { error: 'Not found' });

  const [existing] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  if (!existing) return json(404, { error: 'Not found' });
  if (existing.user_id !== event.user.sub) return json(403, { error: 'Forbidden' });

  let body: { title?: unknown; description?: unknown; completed?: unknown; due_date?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.title === 'string' && body.title.trim()) updates['title'] = body.title.trim();
  if ('description' in body) updates['description'] = typeof body.description === 'string' ? body.description : null;
  if (typeof body.completed === 'boolean') updates['completed'] = body.completed;
  if ('due_date' in body) updates['due_date'] = typeof body.due_date === 'string' && body.due_date ? new Date(body.due_date) : null;

  if (Object.keys(updates).length === 0) {
    return json(200, { todo: existing });
  }

  await db.update(schema.todos).set(updates).where(eq(schema.todos.id, id));

  const [todo] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  return json(200, { todo });
});
