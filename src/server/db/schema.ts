import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const allowedDomainsEnum = pgEnum("allowed_domains", [
  "zaplink, flowfolio",
  "money-mogul",
]);

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: false,
    mode: "date",
  }).notNull(),
  ip: text("ip").notNull(),
  allowedDomains: allowedDomainsEnum("allowed_domains"),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email"),
  image: text("image"),
});

export const accountTypeEnum = pgEnum("account_type_enum", [
  "discord",
  "email",
]);

export const accounts = pgTable("account", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  provider: accountTypeEnum("provider").notNull(),
});

export const links = pgTable(
  "links",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    url: text("url").notNull(),
    slug: text("slug").unique().notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: false,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    userIndex: index("user_index").on(table.userId),
    slugIndex: index("slug_index").on(table.slug),
  }),
);

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Link = typeof links.$inferSelect;
