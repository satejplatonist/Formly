import type { FormFieldMapping } from "@/db/schemas"
import FieldRenderer from "./FieldRenderer"

interface FormFieldsRendererProps {
  formFields: FormFieldMapping[]
}

export default function FormFieldsRenderer({ formFields }: FormFieldsRendererProps) {
  const fieldsByColumn = new Map<number, FormFieldMapping[]>()

  formFields.forEach((field) => {
    if (!fieldsByColumn.has(field.columnId)) {
      fieldsByColumn.set(field.columnId, [])
    }
    fieldsByColumn.get(field.columnId)!.push(field)
  })

  const sortedColumns = Array.from(fieldsByColumn.entries())
    .sort(([a], [b]) => a - b)
    .map(([columnId, fields]) => ({
      columnId,
      fields: fields.sort((a, b) => a.sequenceNumber - b.sequenceNumber),
    }))

  const renderColumn = (columnId: number, fields: FormFieldMapping[]) => {
    if (fields.length === 0) return null

    const maxSequence = Math.max(...fields.map((f) => f.sequenceNumber))

    const fieldSlots: (FormFieldMapping | null)[] = new Array(maxSequence).fill(null)

    fields.forEach((field) => {
      fieldSlots[field.sequenceNumber - 1] = field
    })

    return (
      <div key={columnId} className="flex flex-col justify-center min-w-3/6">
        {fieldSlots.map((field, index) => (
          <div key={`${columnId}-${index + 1}`} className="">
            {field ? (
                <FieldRenderer fieldType={field.fieldType} />
            ) : (
              <div className="h-[20px]">
                
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-row items-start gap-4">
      {sortedColumns.map(({ columnId, fields }) => renderColumn(columnId, fields))}
    </div>
  )
}
