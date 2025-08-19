"use client"
import { FieldType, FormFieldsResponse } from "@/app/utils/types";
import { Button } from "@/components/ui/button";
import { FormFieldMapping } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

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

    function useAddColumn() 
    {
        return useMutation({
            mutationKey:['add-column'],
            mutationFn:async(addColumn:{fieldType:FieldType, columnId:number, sequenceNum:number, data:Record<string,any>})=>{
                return await fetch(`/api/addField/?form-id=${form_id}`,{
                    method: "PATCH",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fieldType: addColumn.fieldType,
                        columnId: addColumn.columnId,
                        sequenceNum: addColumn.sequenceNum,
                        data: addColumn.data || {}
                    })
                }).then((res)=>res.json());
            },
            onSuccess: ()=>{
                queryClient.invalidateQueries({queryKey:['form-fields']})
            },
            onError: (error)=>{
                console.log(`Error deleting the form ${error}`)
            },
            retry: 2
        })
    }

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
    const addColumn = useAddColumn();
    const [columns, setColumns] = useState<number[]>([])

    function getMaxColumnId() {
        if (!data || data.formFields.length === 0) return 1;
        const maxColumnId = Math.max(...data.formFields.map(f => f.columnId), 0);
        // +1 so you directly get the next column id and to avoid typos later
        return maxColumnId + 1;
    }

    function getNextSequenceNumber(columnId: number) {
        if(!data) return -1;
        const fieldsInColumns = data.formFields.filter((f) => f.columnId === columnId);
        const maxSequenceNum = fieldsInColumns.length > 0 ? Math.max(...fieldsInColumns.map(f => f.sequenceNumber),0) : 0
        return maxSequenceNum;
    }

    console.log(data);
    
    return(
        <main className={cn('min-h-screen w-full m-auto flex-row flex items-center px-4 lg:px-12 overflow-y-auto overflow-x-hidden')}>
            {/* <EmailElement/> */}
            {
                columns.map((elm)=>(
                    <div key={elm} className="mr-2">
                        elm
                    </div>
                ))
            }
            <Button onClick={()=>{addColumn.mutate({
                fieldType: "SHORT_ANSWER",
                columnId: getMaxColumnId(),
                sequenceNum: 1,
                data: {}
            })}}>Add Column</Button>
        </main>
    );    
}