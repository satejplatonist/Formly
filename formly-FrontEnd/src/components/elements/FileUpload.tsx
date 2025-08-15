import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function FileUploadElement() {
    return(
        <div className="bg-blue-500 flex flex-row items-center justify-center p-1 m-1 w-full lg:w-4/12 gap-x-2 group">
            <div className="flex flex-row items-center justify-evenly opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant={"ghost"} size={"icon"} aria-label="Delete"><Trash2/></Button>
                <Button variant={"ghost"} size={"icon"} aria-label="Add element below"><Plus/></Button>
                <Button variant={"ghost"} size={"icon"} aria-label="Move"><GripVertical/></Button>
            </div>
            <Input 
                type="file" 
                className="w-full">
            </Input>
        </div>
    );
}

