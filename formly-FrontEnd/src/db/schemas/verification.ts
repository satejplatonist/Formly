import { pgTable, varchar, timestamp, uniqueIndex, unique, text } from "drizzle-orm/pg-core"; // Adjust import based on your database (e.g., mysqlTable for MySQL)

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});


export type verification = typeof verification.$inferSelect;
