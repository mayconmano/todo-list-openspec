import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth } from '../../middleware/withAuth';
import { json, empty } from '../../lib/response';

export const handler = withAuth(async (event) => {
  const id = parseInt(event.pathParameters?.['id'] ?? '', 10);
  if (!id) return json(404, { error: 'Not found' });

  const [existing] = await db
    .select()
    .from(schema.todos)
    .where(eq(schema.todos.id, id));

  if (!existing) return json(404, { error: 'Not found' });
  if (existing.user_id !== event.user.sub) return json(403, { error: 'Forbidden' });

  await db.delete(schema.todos).where(eq(schema.todos.id, id));

  return empty(204);
});
