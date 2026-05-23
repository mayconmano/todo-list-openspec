import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { verifyToken, type JwtPayload } from '../lib/jwt';

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user: JwtPayload;
}

type AuthenticatedHandler = (
  event: AuthenticatedEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

const unauthorized = {
  statusCode: 401,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ error: 'Não autorizado' }),
};

export const withAuth =
  (handler: AuthenticatedHandler) =>
  async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const authHeader = event.headers['Authorization'] ?? event.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return unauthorized;

    const token = authHeader.slice(7);
    try {
      const user = verifyToken(token);
      return handler({ ...event, user }, context);
    } catch {
      return unauthorized;
    }
  };
