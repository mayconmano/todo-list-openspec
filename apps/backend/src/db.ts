import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as usersSchema from './schema/users';
import * as todosSchema from './schema/todos';

const schema = { ...usersSchema, ...todosSchema };

const required = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log('[db] MySQL connected successfully');
  } catch (err) {
    console.error('[db] MySQL connection failed:', (err as Error).message);
    process.exit(1);
  }
})();

export const db = drizzle(pool, { schema, mode: 'default' });
export { schema };
