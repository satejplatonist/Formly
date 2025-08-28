import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormBuilder from "./formBuilder";
import { FormFieldRendererProps } from "@/app/utils/types";

export default function ElementSelectorForm({formField, form_id}:FormFieldRendererProps) 
{
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant={"ghost"} 
                    size={"icon"} 
                    aria-label="Add element below">
                        <Plus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="px-4 h-11/12 min-w-3/6 flex flex-col">
                <DialogHeader className="h-8 flex-shrink-0">
                    <DialogTitle className="px-2 h-full">Element Selector</DialogTitle>
                </DialogHeader>
                <div className="flex-1 w-full rounded-sm overflow-hidden">
                    <FormBuilder formField={formField} form_id={form_id}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}