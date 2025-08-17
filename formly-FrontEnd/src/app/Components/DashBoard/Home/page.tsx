"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Ellipsis, Link, PencilLine, Plus, Trash2 } from "lucide-react";
import CreateForm from "../../Forms/CreateForm";
import { Suspense, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function FormsListSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center gap-y-4 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}
          className="flex flex-row items-center justify-between w-full py-2 px-4 rounded-md border border-gray-200"
        >
          <Skeleton className="h-5 w-32 rounded" />

          <div className="flex flex-row items-center justify-evenly gap-x-1">
            <Skeleton className="h-8 w-14 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </section>
  );
}

function ErrorFallBack({error}:{error:Error})
{
    return <div className="text-red-500">Failed to load forms</div>;
}

export default function Home() 
{
    const [editingId, setEditingId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const {data,error,isLoading} = useQuery({
        queryKey:['forms'],
        queryFn: async function fetchForms() {
            const response = await fetch('/api/getFormsList')
            if(!response.ok){
                throw new Error("Network response was not ok { formList }")
            }
            return response.json();
        }
    })

    const mutation = useMutation({
        mutationKey:['form-update'],
        mutationFn: async(updateForm:{formId:number, value:string})=>{
            return fetch(`/api/changeFormName?form-id=${updateForm.formId}`,{
                method:"PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formName: updateForm.value })
            }).then((res)=>res.json())
        },
        retry:2
    })

    function updateFormName(formId:number, value:string) {
        mutation.mutate({formId,value},{
                onSuccess: (data) => {
                    toast.success(`Form "${data.message}" name updated successfully!`)
                    queryClient.invalidateQueries({queryKey:['forms']}); 
                },
                onError: (err) => {
                    console.log(`Error in updating form ${err}`);
                    toast.error("Failed to update form");
                }
        })
    }

    function useDeleteForm() 
    {
        return useMutation({
            mutationKey:['form-delete'],
            mutationFn:async(formId: number)=>{
                return fetch(`/api/deleteForm?form-id=${formId}`,{
                    method: "DELETE",
                    headers: { 'Content-Type': 'application/json' },
                }).then((res)=>{
                    if(res.ok) {
                        return res.json()
                    }else{
                        throw new Error(data.error || "Failed to delete form");
                    }
                })
                  .catch((error)=>{
                    console.log(`Failed to delete form ${error}`)
                  })
            },
            onSuccess: () =>{
                toast.success("Form deleted successfully!");
                queryClient.invalidateQueries({queryKey:['forms']})
            },
            onError: (error) =>{
                console.log(`Error deleting the form ${error}`)
            },
            retry:2
        })
    }

    console.log(data)

    const [open, setOpen] = useState<Boolean>(false);
    const deleteForm = useDeleteForm();
    return(
        <main className="w-full min-h-full flex flex-col items-center pt-32 px-4 md:px-20 lg:px-32 gap-y-4">
            <section className="flex flex-row items-center justify-between w-full px-2">
                <h1 className="text-xl lg:text-2xl font-bold tracking-wide text-zinc-700">Home</h1>
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-800"
                    onClick={()=>{setOpen(true)}}>
                    <Plus/>Create Form
                </Button>
            </section>

            <Separator/>

            <ErrorBoundary errorComponent={ErrorFallBack}>
                <Suspense fallback={<FormsListSkeleton/>}>
                    <section className="flex flex-col items-center justify-center gap-y-4 w-full">
                        {data?.formName && data?.formName?.length > 0 ? (
                            data.formName.map((form: {name:string, formId: number}) => (
                            <div key={form.formId} className="flex flex-row items-center justify-between w-full hover:bg-slate-100/75 py-2 px-4 rounded-md">
                                {editingId !== form.formId ? (
                                    <h1 onClick={()=>setEditingId(form.formId)}>{form.name}</h1>
                                ) : (
                                    <Input
                                        autoFocus
                                        onBlur={()=>setEditingId(null)}
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter") {
                                                updateFormName(form.formId, e.currentTarget.value);
                                                setEditingId(null);
                                            }
                                        }}     
                                        defaultValue={form.name}
                                    />
                                )}
                                <div className="flex flex-row items-center justify-evenly gap-x-1">
                                    <Button variant={"ghost"}><PencilLine />Edit</Button>
                                    <Button variant={"ghost"}><Link /></Button>
                                    <Button variant={"ghost"} onClick={()=>{
                                        deleteForm.mutate(form.formId)
                                    }}>
                                        <Trash2 />
                                    </Button>
                                    <Button variant={"ghost"}><Ellipsis /></Button>
                                </div>
                                </div>
                            ))
                        ) : (
                            <FormsListSkeleton/>
                        )}
                    </section>
                </Suspense>
            </ErrorBoundary>
            <CreateForm open={open} onClose={()=>{setOpen(false)}}/>
        </main>
    );    
};
