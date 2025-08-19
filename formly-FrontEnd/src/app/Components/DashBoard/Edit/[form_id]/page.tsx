"use client"
import { FieldType } from "@/app/utils/types";
import { Button } from "@/components/ui/button";
import { FormFieldMapping } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

// type FormEditProps = {
//     params:{
//         form_id:string
//     }
// }

export default function EditForm({params}:{params: Promise<{form_id: string}>}) 
{
    const [status, setStatus] = useState<"loading"| "valid" | "not-found" | "error">("loading");
    const router = useRouter();
    const { form_id } = use(params);
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkForm = async () => {
            try {
                const res = await fetch(`/api/form-exists?form-id=${form_id}`);
                const data = await res.json()
                if (data.status === 200) {
                    setStatus("valid");
                } else if (data.status === 404) {
                    router.push('/Components/DashBoard/Home')
                } else {
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
                return await fetch(`/api/add-column/?form-id=${form_id}`,{
                    method: "PATCH",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formId: form_id,
                        fieldType: addColumn.fieldType,
                        columnId: addColumn.columnId,
                        sequenceNum: addColumn.sequenceNum,
                        data: addColumn.data || {}
                    })
                }).then((res)=>res.json());
            },
            onSuccess: ()=>{
                queryClient.invalidateQueries({queryKey:['']})
            },
            onError: (error)=>{
                console.log(`Error deleting the form ${error}`)
            },
            retry: 2
        })
    }

    const {data, error, isLoading, } = useQuery<FormFieldMapping[]>({
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
        if(!data || data.length === 0) return 0;
        const maxColumnId = data ? Math.max(...data.map((f) => f.columnId),0):0;
        return maxColumnId;
    }

    function getNextSequenceNumber(columnId: number) {
        if(!data) return -1;
        const fieldsInColumns = data.filter((f) => f.columnId === columnId);
        const maxSequenceNum = fieldsInColumns.length > 0 ? Math.max(...fieldsInColumns.map(f => f.sequenceNumber),0) : 0
        return maxSequenceNum;
    }
    
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
                columnId: 1,
                sequenceNum: 1,
                data: {}
            })}}>Add Column</Button>
        </main>
    );    
}