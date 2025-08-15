import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"

export const formFields = pgTable("form_fields", {
  formFieldId: serial("form_field_id").primaryKey(),
  fieldName: varchar("field_name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type FormField = typeof formFields.$inferSelect
export type NewFormField = typeof formFields.$inferInsert
