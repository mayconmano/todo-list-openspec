import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth, type AuthenticatedEvent } from '../../middleware/withAuth';
import { json } from '../../lib/response';

const meHandler = async (event: AuthenticatedEvent) => {
  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      created_at: schema.users.created_at,
    })
    .from(schema.users)
    .where(eq(schema.users.id, event.user.sub))
    .limit(1);

  if (!user) return json(401, { error: 'Não autorizado' });

  return json(200, user);
};

export const handler = withAuth(meHandler);
