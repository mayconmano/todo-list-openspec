import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { withAuth, type AuthenticatedEvent } from '../../middleware/withAuth';
import { json } from '../../lib/response';

const changePasswordHandler = async (event: AuthenticatedEvent) => {
  let body: { current_password?: unknown; new_password?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(422, { error: 'Dados inválidos' });
  }

  const { current_password, new_password } = body;

  if (typeof current_password !== 'string' || typeof new_password !== 'string') {
    return json(422, { error: 'Dados inválidos' });
  }

  if (new_password.length < 8) {
    return json(422, { error: 'Dados inválidos' });
  }

  const [user] = await db
    .select({ id: schema.users.id, password: schema.users.password })
    .from(schema.users)
    .where(eq(schema.users.id, event.user.sub))
    .limit(1);

  if (!user) return json(401, { error: 'Não autorizado' });

  const valid = await bcrypt.compare(current_password, user.password);
  if (!valid) return json(401, { error: 'Senha atual incorreta' });

  const hash = await bcrypt.hash(new_password, 10);
  await db.update(schema.users).set({ password: hash }).where(eq(schema.users.id, event.user.sub));

  return json(200, { message: 'Senha atualizada' });
};

export const handler = withAuth(changePasswordHandler);
