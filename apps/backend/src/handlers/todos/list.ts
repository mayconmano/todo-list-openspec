import { and, eq, like, isNull, gte, lte, count, desc } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth } from '../../middleware/withAuth';
import { json } from '../../lib/response';

export const handler = withAuth(async (event) => {
  const q = event.queryStringParameters ?? {};
  const page = Math.max(1, parseInt(q['page'] ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(q['limit'] ?? '20', 10) || 20));
  const offset = (page - 1) * limit;
  const search = q['search'] ?? '';
  const status = q['status'] ?? 'all';
  const dueDateFrom = q['due_date_from'] ?? '';
  const dueDateTo = q['due_date_to'] ?? '';
  const dueDatePreset = q['due_date_preset'] ?? '';

  if (status !== 'all' && status !== 'pending' && status !== 'completed') {
    return json(400, { error: 'status must be all, pending, or completed' });
  }

  const userId = event.user.sub;
  const conditions = [eq(schema.todos.user_id, userId)];

  if (search) {
    conditions.push(like(schema.todos.title, `%${search}%`));
  }

  if (status === 'pending') {
    conditions.push(eq(schema.todos.completed, false));
  } else if (status === 'completed') {
    conditions.push(eq(schema.todos.completed, true));
  }

  if (dueDatePreset === 'no_due_date') {
    conditions.push(isNull(schema.todos.due_date));
  } else {
    if (dueDateFrom) {
      conditions.push(gte(schema.todos.due_date, dueDateFrom));
    }
    if (dueDateTo) {
      conditions.push(lte(schema.todos.due_date, dueDateTo));
    }
  }

  const where = and(...conditions);

  const [totalRow] = await db
    .select({ count: count() })
    .from(schema.todos)
    .where(where);

  const total = totalRow?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  const data = await db
    .select()
    .from(schema.todos)
    .where(where)
    .orderBy(desc(schema.todos.created_at))
    .limit(limit)
    .offset(offset);

  return json(200, { data, total, page, totalPages });
});
