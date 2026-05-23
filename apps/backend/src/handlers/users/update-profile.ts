import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth, type AuthenticatedEvent } from '../../middleware/withAuth';
import { json } from '../../lib/response';

const updateProfileHandler = async (event: AuthenticatedEvent) => {
  let body: { name?: unknown; birth_date?: unknown; avatar_url?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(422, { error: 'Dados inválidos' });
  }

  const updates: Partial<{ name: string; birth_date: Date | null; avatar_url: string | null }> = {};

  if ('name' in body) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return json(422, { error: 'Dados inválidos' });
    }
    updates.name = body.name.trim();
  }

  if ('birth_date' in body) {
    if (typeof body.birth_date === 'string' && body.birth_date) {
      const d = new Date(body.birth_date);
      updates.birth_date = isNaN(d.getTime()) ? null : d;
    } else {
      updates.birth_date = null;
    }
  }

  if ('avatar_url' in body) {
    updates.avatar_url = typeof body.avatar_url === 'string' ? body.avatar_url : null;
  }

  if (Object.keys(updates).length === 0) {
    const [user] = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        birth_date: schema.users.birth_date,
        avatar_url: schema.users.avatar_url,
        created_at: schema.users.created_at,
      })
      .from(schema.users)
      .where(eq(schema.users.id, event.user.sub))
      .limit(1);

    return json(200, user);
  }

  await db
    .update(schema.users)
    .set(updates)
    .where(eq(schema.users.id, event.user.sub));

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      birth_date: schema.users.birth_date,
      avatar_url: schema.users.avatar_url,
      created_at: schema.users.created_at,
    })
    .from(schema.users)
    .where(eq(schema.users.id, event.user.sub))
    .limit(1);

  return json(200, user);
};

export const handler = withAuth(updateProfileHandler);
