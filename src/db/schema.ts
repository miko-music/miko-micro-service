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
    clientId: integer('clientId'),
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
    clientId: integer('clientId'),
    installmentPaymentId: integer('installmentPaymentId'),
});
export const calendarEvent = sqliteTable('calendar_event', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(),
    event: text('event').notNull(),
    isCompleteDay: integer('is_complete_day', { mode: 'boolean' }).notNull(),
    isBirthday: integer('is_birthday', { mode: 'boolean' }).notNull(),
    isVacation: integer('is_vacation', { mode: 'boolean' }).notNull(),
    clientId: integer('clientId'),
});
