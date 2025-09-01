"use client"
import { FormFieldsResponse } from "@/app/utils/types";
import FormFieldsRenderer from "@/components/helpers/FormFieldsRenderer";
import { Button } from "@/components/ui/button";
import { useAddField } from "@/hooks/use-add-field";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { FormFieldMapping } from "@/db/schemas";
import { arrayMove } from "@dnd-kit/sortable";
import FieldRenderer from "@/components/helpers/FieldRenderer";
import { ArrowRight, CircleArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useGetSharedUrl } from "@/hooks/use-get-sharedurl";

type FormEditParams = {
    form_id:string
}

export default function EditForm({params}:{params: Promise<FormEditParams>}) 
{
    const [status, setStatus] = useState<"loading"| "valid" | "not-found" | "error">("loading");
    const router = useRouter();
    const resolvedParams = use(params);
    const form_id = resolvedParams.form_id;

    const queryClient = useQueryClient();

    const addColumn = useAddField(form_id);
    const {sharedUrldata, sharedError, sharedLoading} = useGetSharedUrl(form_id);

    const [active, setActive] = useState<FormFieldMapping | null>(null);

    useEffect(() => {
        const checkForm = async () => {
            try {
                const res = await fetch(`/api/form-exists?form-id=${form_id}`);
                const data = await res.json()
                if (data.status === 404 || data.status === 400 || data.status === 500) {
                    console.log("here 2")
                    router.push('/Components/DashBoard/Home')
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        checkForm();
    }, [form_id]);

    const {data, error, isLoading, } = useQuery<FormFieldsResponse>({
        queryKey: ['form-fields'],
        queryFn:async function getFormFields() {
            const response = await fetch(`/api/getFormFields/?form-id=${form_id}`,{
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })

            if(!response.ok){
                throw new Error("Network response was not ok { FormFieldList }")
            }
            return response.json();
        }
    })

    const updatePositionMutation = useMutation({
        mutationKey: ["field-pos-update"],
        mutationFn: async (reorderedFields: FormFieldMapping[]) => {
        const response = await fetch(`/api/fieldUpdate/?form-id=${form_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                reorderedFields: reorderedFields,
                }),
            })
            if (!response.ok) {
                throw new Error("Failed to update field positions")
            }
            return response.json()
        },
        onSuccess: (data) => {
            console.log("Successfully updated fields", data)
            queryClient.invalidateQueries({ queryKey: ["form-fields"] })
        },
        onError: (error) => {
            console.error("Error in updating field position", error)
        },
        retry: 2,
    })

    function getMaxColumnId() {
        if (!data || data.formFields.length === 0) return 1;
        const maxColumnId = Math.max(...data.formFields.map(f => f.columnId), 0);
        // +1 so you directly get the next column id and to avoid typos later
        return maxColumnId + 1;
    }

    function onDragStart(event: DragStartEvent) {
        if(event.active.data.current?.type === "Field")
        {
            setActive(event.active.data.current.formField);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) 
    {
        const { active, over } = event
        setActive(null)
        if (!over || !data) return
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return
        const activeIndex = data.formFields.findIndex((field) => field.formFieldMapId === activeId)
        const overIndex = data.formFields.findIndex((field) => field.formFieldMapId === overId)

        if (activeIndex === -1 || overIndex === -1) return

        // Create reordered array
        const reorderedFields = arrayMove([...data.formFields], activeIndex, overIndex)
        const fieldsByColumn = new Map<number, FormFieldMapping[]>()

        reorderedFields.forEach((field) => {
        if (!fieldsByColumn.has(field.columnId)) {
            fieldsByColumn.set(field.columnId, [])
        }
        fieldsByColumn.get(field.columnId)!.push(field)
        })

        // Reassign sequence numbers within each column
        const updatedFields: FormFieldMapping[] = []
        fieldsByColumn.forEach((fields, columnId) => {
        fields.forEach((field, index) => {
            updatedFields.push({
            ...field,
            sequenceNumber: index + 1,
            })
        })
        })
        updatePositionMutation.mutate(updatedFields)     
    }
    
    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over || !data) return
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return
        const activeIndex = data.formFields.findIndex((field) => field.formFieldMapId === activeId)
        const overIndex = data.formFields.findIndex((field) => field.formFieldMapId === overId)

        if (activeIndex === -1 || overIndex === -1) return

        const reordered = arrayMove([...data.formFields], activeIndex, overIndex)
            queryClient.setQueryData(["form-fields"], (oldData: FormFieldsResponse | undefined) =>
            oldData ? { ...oldData, formFields: reordered } : oldData,
        )
    }
    
    return(
        <main className={cn('min-h-screen w-full justify-center gap-y-8 flex flex-col items-center px-0 lg:px-12 py-8',
        'overflow-x-auto bg-slate-50')}>
            <div className="self-start ml-auto">
                {sharedLoading && <p>Loading...</p>}

                {sharedError && <p className="text-red-500">Error loading URL</p>}

                {sharedUrldata?.sharedUrl && (
                    <Link href={`/Components/DashBoard/shared/${sharedUrldata?.sharedUrl}`}>
                        <Button variant="ghost" className="bg-emerald-600 text-neutral-50 px-8 md: mr-4">
                            Publish <CircleArrowOutUpRight />
                        </Button>
                    </Link>
                )}
            </div>
            <div className="overflow-x-auto min-w-full flex-grow">
                <DndContext sensors={useSensors(
                    useSensor(PointerSensor,{
                        activationConstraint:{            
                            distance:3
                        },
                    }),
                    useSensor(MouseSensor, {
                        activationConstraint: {
                            distance: 10,
                        }
                    })
                )} onDragStart={onDragStart}
                   onDragOver={onDragOver}
                   onDragEnd={onDragEnd}>
                    <FormFieldsRenderer formFields={data?.formFields ?? []} form_id={form_id}/>

                    <Button className="mt-8 text-md ml-28">Submit<ArrowRight/></Button>
                    
                    <DragOverlay>
                        {active ? (
                        <div className="opacity-50 bg-red-300">
                            <FieldRenderer formField={active} form_id={form_id} />
                        </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
            <div className="flex justify-between items-center">
                <Button onClick={()=>{addColumn.mutate({
                    fieldType: "SHORT_ANSWER",
                    columnId: getMaxColumnId(),
                    sequenceNum: 1,
                    data: {}
                })}}>Add Column</Button>
            </div>
        </main>
    );    
}