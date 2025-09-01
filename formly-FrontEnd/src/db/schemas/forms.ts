import { pgTable, serial, varchar, integer, timestamp, text } from "drizzle-orm/pg-core"
import { user } from "./users"

export const forms = pgTable("form", {
  formId: serial("form_id").primaryKey(),
  formName: varchar("form_name", { length: 255 }).notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  shareUrl: varchar("share_url").$defaultFn(() => crypto.randomUUID()).notNull()
})

export type Form = typeof forms.$inferSelect
export type NewForm = typeof forms.$inferInsert
