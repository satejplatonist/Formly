import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ElementSelectorForm from "@/app/Components/FormOpener/FormOpener";

export function TimerElement() {
    return(
        <div className="flex flex-row items-center justify-center p-1 m-1 w-full lg:w-4/12 gap-x-2 group">
            <div className="flex flex-row items-center justify-evenly opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant={"ghost"} size={"icon"} aria-label="Delete"><Trash2/></Button>
                <ElementSelectorForm/>                
                <Button variant={"ghost"} size={"icon"} aria-label="Move"><GripVertical/></Button>
            </div>
            <Input 
                id="time-picker" 
                defaultValue="10:30:00" 
                type="time" step={1} 
                className="w-full appearance-none 
                    [&::-webkit-calendar-picker-indicator]:hidden 
                    [&::-webkit-calender-picker-indicator]:appearance-none
                    [&::-webkit-inner-spin-button]:hidden
                    [&::-webkit-clear-button]:hidden">
            </Input>
        </div>
    );
}

