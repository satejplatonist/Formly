"use client"
import { GripVertical, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ElementSelectorForm from "@/app/Components/FormOpener/FormOpener"
import { ElementProps, FormFieldRendererProps } from "@/app/utils/types"
import { useDeleteForm } from "@/hooks/use-delete-fields"
import React from "react"

export function InputElement({formField, form_id, dragHandle}:ElementProps) {

  const deleteField = useDeleteForm(form_id, formField.formFieldMapId, formField.sequenceNumber)

  return (
    <div className="bg-transparent flex flex-row items-center justify-center py-1 w-full gap-x-2 group">
      <div className="bg-transparent flex flex-row items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button onClick={()=> {deleteField.mutate()}} variant={"ghost"} size={"icon"} aria-label="Delete" className="">
          <Trash2 />
        </Button>
        <ElementSelectorForm formField={formField} form_id={form_id}/>
        {dragHandle}
      </div>
      <Input className="w-full border-2 border-zinc-300" placeholder="Enter your answer..." />
    </div>
  )
}
