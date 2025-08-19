"use client"
import { useState } from "react";
import { FIELD_TYPES } from "./fieldtypes";
import { Button } from "@/components/ui/button";
import { ArrowRight, CirclePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RenderPreviewProps{
    selectedType:string | null
} 

export default function FormBuilder() 
{
    const [selectedType, setSelectedType] = useState<string | null>(null);
    return(
         <section className="flex flex-row h-12/12 w-full">
            <section className="w-1/3 h-full flex flex-col items-start justify-start p-2 gap-y-2 overflow-auto">
                {
                    FIELD_TYPES.map((elms)=>(
                        <Button variant={"ghost"} 
                                onClick={()=>setSelectedType(elms.id)} 
                                key={elms.id}
                                className="bg-emerald-100 w-full lg:w-5/6 text-zinc-800">
                            {elms.icon}{elms.name}
                        </Button>
                    ))
                }
            </section>
            <section className="w-2/3 h-full flex flex-col items-start justify-start p-4 overflow-auto">
                <RenderPreview selectedType={selectedType}/>
            </section>
        </section>
    );
}

const RenderPreview = ({selectedType}:RenderPreviewProps) =>{
    if(!selectedType)
    {
        return(
            <div className="flex flex-col items-center justify-center gap-y-2 ">
                <CirclePlus size={40} className="bg-zinc-500 text-white rounded-full" /> 
                <h2 className="text-zinc-700 text-md font-bold">Insert Anything</h2>           
            </div>
        );
    }
    const type = FIELD_TYPES.find((t)=>t.id === selectedType)
    if(!type) return null;

    switch (selectedType) {
        case FIELD_TYPES.at(0)?.id:
            return(
                <div className="flex flex-col items-start justify-start w-full gap-y-8">
                    <section className="flex flex-col items-start justify-start w-full gap-y-4">
                        <div className="flex flex-row items-center justify-between w-full">
                        <h1 className="text-md md:text-lg lg:text-xl font-bold ">{FIELD_TYPES.at(0)?.name}</h1>
                        <Button size={"sm"} className="md:w-20 lg:w-24 flex justify-evenly">Insert <ArrowRight/></Button>
                        </div>
                        <p>{FIELD_TYPES.at(0)?.description}</p>
                    </section>
                    <Separator className="bg-zinc-300" />
                    <section className="flex flex-col items-start justify-start gap-y-4 w-full">
                        <Badge variant={"secondary"}>Example</Badge>
                        <Input className="w-full" />
                    </section>
                </div>
            );
        case FIELD_TYPES.at(1)?.id:
            return(
                <div className="flex flex-col items-start justify-start w-full gap-y-8">
                    <section className="flex flex-col items-start justify-start w-full gap-y-4">
                        <div className="flex flex-row items-center justify-between w-full">
                        <h1 className="text-md md:text-lg lg:text-xl font-bold ">{FIELD_TYPES.at(1)?.name}</h1>
                        <Button size={"sm"} className="md:w-20 lg:w-24 flex justify-evenly">Insert <ArrowRight/></Button>
                        </div>
                        <p>{FIELD_TYPES.at(1)?.description}</p>
                    </section>
                    <Separator className="bg-zinc-300" />
                    <section className="flex flex-col items-start justify-start gap-y-4 w-full">
                        <Badge variant={"secondary"}>Example</Badge>
                        <Textarea className="w-full" />
                    </section>
                </div>
            );
        default:
            return(
                <div>Default</div>
            );
    }
}