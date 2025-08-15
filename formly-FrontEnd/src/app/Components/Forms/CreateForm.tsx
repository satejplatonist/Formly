import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from "zod";
import { toast, Toaster } from 'sonner'
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormProps{
    open: Boolean,
    onClose: ()=>void,
    children?: React.ReactElement 
}

const formSchema = z.object({
    formName: z.string().min(3,{
        message:"form name must be atleast 3 characters"
    }).max(255,{
        message:"form name can't be more than 255 characters"
    })
})

export default function CreateForm({open, onClose, children}:FormProps) 
{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            formName:''
        }
    })

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async(formData:{formName:string}) => {
            console.log(formData);
             return fetch('/api/createForm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            }).then(res => res.json())
        },
        retry:2
    })

    async function onSubmit(values: z.infer<typeof formSchema>)
    {
        try {
            mutation.mutate(values,{
                onSuccess: (data) => {
                    toast.success(`Form "${data.form}" created successfully!`)
                    queryClient.invalidateQueries({queryKey:['forms']}); 
                    onClose();
                },
                onError: (err) => {
                    if (err?.message?.includes('exists')) {
                        toast.error("Form name already exists");
                    } else {
                        toast.error("Failed to create form");
                    }
                }
            })
        } catch (error) {
            console.error('Error submitting newsletter form', error)
        }
    }

    return(
        <div onClick={onClose} 
            className={`fixed inset-0 flex justify-center items-center transition-colors 
                    ${open?'visible bg-neutral-50/20':'invisible'}`}>
                
            <div onClick={(e)=>{e.stopPropagation()}} 
                className="w-3/5 lg:w-1/4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Create Form 
                        </CardTitle>
                        <CardDescription>
                            Please fill out your form name
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-y-4">
                            <FormField
                              control={form.control}
                              name="formName"
                              render={({field})=>(
                                <FormItem>
                                    <FormLabel htmlFor="formName" className="text-lg">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                        id='formName'
                                        placeholder="form-1"
                                        type="text"
                                        autoFocus
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                              )}
                            />

                            <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-emerald-700 to-emerald-900 text-md">Create</Button>
                            </form> 
                        </Form>
                        <Button onClick={onClose} className="w-full mt-2" variant={"destructive"}>Cancel</Button>
                    </CardContent>
                </Card>
            </div>
            <Toaster position="bottom-center" richColors/>
        </div>
   );    
};
