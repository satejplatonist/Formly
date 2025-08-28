"use client"
import { FieldType } from "@/app/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddField(form_id:string) 
    {
        const queryClient = useQueryClient();

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