import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteForm(form_id:string, fieldId: number, sequenceNum: number) 
    {
        const queryClient = useQueryClient();
        
        return useMutation({
            mutationKey:['form-delete'],
            mutationFn:async()=>{
                return fetch(`/api/deleteField?form-id=${form_id}`,{
                    method: "DELETE",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fieldId,
                        sequenceNum
                    })
                }).then((res)=>{
                    if(res.ok) {
                        return res.json()
                    }else{
                        throw new Error("Failed to delete field");
                    }
                })
                  .catch((error)=>{
                    console.log(`Failed to delete form ${error}`)
                  })
            },
            onSuccess: () =>{
                toast.success("Field deleted successfully!");
                queryClient.invalidateQueries({queryKey:['form-fields']})
            },
            onError: (error) =>{
                console.log(`Error deleting the form ${error}`)
            },
            retry:2
        })
    }