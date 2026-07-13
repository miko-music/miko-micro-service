import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const income = sqliteTable('income', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    date: text('date').notNull(),
    updatedAt: text('updatedAt').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    type: text('type').notNull(),
    amount: real('amount').notNull(),
    serverId: integer('serverId'),
});
export const outgoing = sqliteTable('outgoing', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    date: text('date').notNull(),
    updatedAt: text('updatedAt').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    type: text('type').notNull(),
    amount: real('amount').notNull(),
    serverId: integer('serverId'),
    installmentPaymentId: integer('installmentPaymentId'),
});