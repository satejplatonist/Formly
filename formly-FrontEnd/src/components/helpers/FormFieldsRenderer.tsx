import type { FormFieldMapping } from "@/db/schemas"
import FieldRenderer from "./FieldRenderer"
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface FormFieldsRendererProps {
  formFields: FormFieldMapping[],
  form_id: string
}

export default function FormFieldsRenderer({ formFields, form_id }: FormFieldsRendererProps) {
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

    const sortableItems = fieldSlots.filter((field) => field != null).map((field) => field.formFieldMapId)

    return (
      <div key={columnId} className="flex flex-col justify-center lg:min-w-5/12 md:min-w-4/6 pl-12 ">
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {fieldSlots.map((field, index) => (
            <div key={`${columnId}-${index + 1}`} className={`-mx-14`}>
              {field ? (
                  <FieldRenderer formField={field} form_id={form_id}/>
              ) : (
                <div className="h-[0px]">
                  
                </div>
              )}
            </div>
          ))}
        </SortableContext>
      </div>
    )
  }

  return (
    <div className="flex flex-row items-center overflow-auto">
        {sortedColumns.map(({ columnId, fields }) => renderColumn(columnId, fields))}
    </div>
  )
}
