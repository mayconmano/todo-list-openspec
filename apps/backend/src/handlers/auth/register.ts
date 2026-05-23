import type { APIGatewayProxyHandler } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, schema } from '../../db';
import { signToken } from '../../lib/jwt';
import { json } from '../../lib/response';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handler: APIGatewayProxyHandler = async (event) => {
  let body: { email?: unknown; password?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return json(422, { error: 'Dados inválidos' });
  }

  const { email, password } = body;

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return json(422, { error: 'Dados inválidos' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return json(422, { error: 'Dados inválidos' });
  }

  const normalizedEmail = email.toLowerCase();

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    return json(409, { error: 'Email já cadastrado' });
  }

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.insert(schema.users).values({
    email: normalizedEmail,
    password: hash,
  });

  const id = (result as { insertId: number }).insertId;
  const token = signToken({ sub: id, email: normalizedEmail });

  return json(201, { token, user: { id, email: normalizedEmail } });
};
