import { mysqlTable, int, varchar, text, boolean, date, timestamp } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const todos = mysqlTable('todos', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  due_date: date('due_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
