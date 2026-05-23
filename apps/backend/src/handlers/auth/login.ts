import type { APIGatewayProxyHandler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { signToken } from '../../lib/jwt';
import { json } from '../../lib/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  let body: { email?: unknown; password?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(401, { error: 'Credenciais inválidas' });
  }

  const { email, password } = body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return json(401, { error: 'Credenciais inválidas' });
  }

  const normalizedEmail = email.toLowerCase();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    return json(401, { error: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return json(401, { error: 'Credenciais inválidas' });
  }

  const token = signToken({ sub: user.id, email: user.email });

  return json(200, {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      birth_date: user.birth_date,
      avatar_url: user.avatar_url,
    },
  });
};
