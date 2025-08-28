import type { FormFieldMapping } from "@/db/schemas";
import { InputElement } from "../elements/Input";
import { TextAreaElement } from "../elements/TextArea";
import {FormFieldRendererProps} from '@/app/utils/types'
import { GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

export default function FieldRenderer({formField, form_id}:FormFieldRendererProps) 
{
    const { setNodeRef, listeners, attributes, transform, transition } = useSortable({
        id: formField.formFieldMapId,
        data: {
            type: "Field",
            field: formField,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const dragHandle = (
        <Button variant={"ghost"} 
                size={"icon"} 
                aria-label="Move"
                className="cursor-grab"
                {...attributes} {...listeners}>
          <GripVertical />
        </Button>
    );

    return (
        <div ref={setNodeRef} style={style} >

            {formField.fieldType === "SHORT_ANSWER" && (
              <InputElement formField={formField} form_id={form_id} dragHandle={dragHandle} />
            )}

            {formField.fieldType === "LONG_ANSWER" && (
              <TextAreaElement formField={formField} form_id={form_id} dragHandle={dragHandle} />
            )}

        </div>
    );
};
