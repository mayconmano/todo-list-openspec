import { mysqlTable, int, varchar, timestamp, date } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  birth_date: date('birth_date'),
  avatar_url: varchar('avatar_url', { length: 500 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
