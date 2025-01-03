import type { InferSelectModel } from 'drizzle-orm';
import {
  mysqlTable,
  varchar,
  timestamp,
  json,
  char,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable('User', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = mysqlTable('Chat', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: char('userId', { length: 36 })
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { length: 7 })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = mysqlTable('Message', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  chatId: char('chatId', { length: 36 })
    .notNull()
    .references(() => chat.id),
  role: varchar('role', { length: 10 }).notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = mysqlTable(
  'Vote',
  {
    chatId: char('chatId', { length: 36 })
      .notNull()
      .references(() => chat.id),
    messageId: char('messageId', { length: 36 })
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = mysqlTable(
  'Document',
  {
    id: char('id', { length: 36 }).notNull(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { length: 4 })
      .notNull()
      .default('text'),
    userId: char('userId', { length: 36 })
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = mysqlTable(
  'Suggestion',
  {
    id: char('id', { length: 36 }).notNull(),
    documentId: char('documentId', { length: 36 }).notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: char('userId', { length: 36 })
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;
