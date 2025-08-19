 // Export all tables
export { user } from "./users"
export { forms } from "./forms"
export { formFieldMappings } from "./form-field-mappings"
export { account } from "./Account"
export { session } from "./sessions"
export { FieldEnum } from "./form-field-mappings"

// Exporting all relations
export {
  usersRelations,
  formsRelations,
  formFieldMappingsRelations,
  accountsRelations
} from "./relations"

// Export all types
export type { User, NewUser } from "./users"
export type { Form, NewForm } from "./forms"
export type { FormFieldMapping, NewFormFieldMapping } from "./form-field-mappings"
export type { Account } from "./Account"
export type { Session } from './sessions'
export type { verification } from "./verification"

// exporting commonly used Drizzle functions
export { eq, and, or, desc, asc } from "drizzle-orm"
