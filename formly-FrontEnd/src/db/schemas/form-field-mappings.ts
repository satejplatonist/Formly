import { pgTable, serial, integer, text, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core"
import { user } from "./users"
import { forms } from "./forms"

export const FieldEnum = pgEnum('field_type',[
    "SHORT_ANSWER", "LONG_ANSWER",
    "MULTIPLE_CHOICE", "CHECKBOXES",
    "DROPDOWN", "MULTI_SELECT",
    "NUMBER", "EMAIL", "PHONE_NUMBER",
    "LINK", "FILE_UPLOAD", "DATE", "TIME",
    "LINEAR_SCALE", "MATRIX", "RATING",
    "PAYMENT", "SIGNATURE", "RANKING", 
    "WALLET_CONNECT"
  ])

export const formFieldMappings = pgTable("form_field_mapping", {
  formFieldMapId: serial("form_field_map_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.formId),
  fieldType: FieldEnum().notNull(),
  columnId: integer("column_id").notNull(),
  sequenceNumber: integer("sequence_number").notNull().default(1),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type FormFieldMapping = typeof formFieldMappings.$inferSelect
export type NewFormFieldMapping = typeof formFieldMappings.$inferInsert
