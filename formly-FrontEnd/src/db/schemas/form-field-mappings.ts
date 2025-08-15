import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./users"
import { forms } from "./forms"
import { formFields } from "./form-fields"

export const formFieldMappings = pgTable("form_field_mapping", {
  formFieldMapId: serial("form_field_map_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.formId),
  fieldId: integer("field_id")
    .notNull()
    .references(() => formFields.formFieldId),
  sequenceNumber: integer("sequence_number").notNull().unique(),
  data: text("data").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type FormFieldMapping = typeof formFieldMappings.$inferSelect
export type NewFormFieldMapping = typeof formFieldMappings.$inferInsert
