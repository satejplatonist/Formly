"use client"
import { GripVertical, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ElementSelectorForm from "@/app/Components/FormOpener/FormOpener"
import { ElementProps, FormFieldRendererProps } from "@/app/utils/types"
import { useDeleteForm } from "@/hooks/use-delete-fields"
import React from "react"

export function TextAreaElement({formField, form_id, dragHandle}:ElementProps){

  const deleteField = useDeleteForm(form_id, formField.formFieldMapId, formField.sequenceNumber)

  return (
    <div className="flex flex-row items-center justify-center py-1 w-full gap-x-2 group">
      <div className="flex flex-row items-center justify-evenly opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button onClick={()=>{deleteField.mutate()}} variant={"ghost"} size={"icon"} aria-label="Delete">
          <Trash2 />
        </Button>
        <ElementSelectorForm formField={formField} form_id={form_id}/>
        {dragHandle}
      </div>
      <Textarea
        className="w-full border-2 border-zinc-300 min-h-[100px]"
        placeholder="Enter your detailed answer..."
        rows={4}
      />
    </div>
  )
}
