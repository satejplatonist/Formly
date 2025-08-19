import { relations } from "drizzle-orm"
import { user } from "./users"
import { forms } from "./forms"
import { formFieldMappings } from "./form-field-mappings"
import { account } from "./Account"
import { session } from "./sessions"

// Users relations
export const usersRelations = relations(user, ({ many }) => ({
  forms: many(forms),
  formFieldMappings: many(formFieldMappings),
  accounts: many(account)
}))

// Forms relations
export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(user, {
    fields: [forms.userId],
    references: [user.id],
  }),
  fieldMappings: many(formFieldMappings),
}))

// Form Field Mappings relations
export const formFieldMappingsRelations = relations(formFieldMappings, ({ one }) => ({
  user: one(user, {
    fields: [formFieldMappings.userId],
    references: [user.id],
  }),
  form: one(forms, {
    fields: [formFieldMappings.formId],
    references: [forms.formId],
  })
}))

// Accounts relations
export const accountsRelations = relations(account,({one})=>({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  })
}))

export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));