import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ElementSelectorForm from "@/app/Components/FormOpener/FormOpener"

export function InputElement() {
  return (
    <div className="flex flex-row items-center justify-center py-1 w-full gap-x-2 group">
      <div className="flex flex-row items-center justify-evenly opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant={"ghost"} size={"icon"} aria-label="Delete">
          <Trash2 />
        </Button>
        <ElementSelectorForm/>
        <Button variant={"ghost"} size={"icon"} aria-label="Move">
          <GripVertical />
        </Button>
      </div>
      <Input className="w-full border-2 border-zinc-300" placeholder="Enter your answer..." />
    </div>
  )
}
