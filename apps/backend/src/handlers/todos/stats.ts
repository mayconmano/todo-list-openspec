import { and, eq, gte, lte, count } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth } from '../../middleware/withAuth';
import { json } from '../../lib/response';

function getWeekBounds(): { weekStart: Date; weekEnd: Date } {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = (day === 0 ? -6 : 1 - day);

  const weekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diffToMonday, 0, 0, 0));
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

export const handler = withAuth(async (event) => {
  const userId = event.user.sub;
  const { weekStart, weekEnd } = getWeekBounds();

  const where = and(
    eq(schema.todos.user_id, userId),
    gte(schema.todos.due_date, weekStart),
    lte(schema.todos.due_date, weekEnd),
  );

  const [totalRow] = await db
    .select({ count: count() })
    .from(schema.todos)
    .where(where);

  const [pendingRow] = await db
    .select({ count: count() })
    .from(schema.todos)
    .where(and(where, eq(schema.todos.completed, false)));

  const [completedRow] = await db
    .select({ count: count() })
    .from(schema.todos)
    .where(and(where, eq(schema.todos.completed, true)));

  return json(200, {
    total: totalRow?.count ?? 0,
    pending: pendingRow?.count ?? 0,
    completed: completedRow?.count ?? 0,
  });
});
