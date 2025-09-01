"use client"
import { SchemaGenerator } from "@/app/utils/zodSchema-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { use } from "react"
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

type ShareUrl = {
    shared_url: string
}

export default function ShareLink({params}:{params: Promise<ShareUrl>}) 
{
    const resolvedParams = use(params);
    const shared_url = resolvedParams.shared_url;
    const queryClient = useQueryClient();

    const {data, error, isLoading} = useQuery({
        queryKey: ['form-field-submission'],
        queryFn: async function getFormFields() {
            const response = await fetch(`/api/get-form-fields-submission/?shared-url=${shared_url}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch shared URL");
            }
            return response.json();
        }
    })

    const formSchema = SchemaGenerator(data?.formFields ?? []);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: data.formFields.reduce(
            (acc:Record<string,string>, field: any) => {
                acc[`field_${field.columnId}_${field.sequenceNumber}`] = "";
                return acc;
            }
        )
    })

    return(
        <main className="min-h-screen w-full flex flex-col items-center justify-center">
            {isLoading && <p>Loading...</p>}

            {error && <p className="text-red-500">Error loading URL</p>}
            {data?.formFields && data.formFields.length > 0 ? (
                <div>
                    {data.formFields.map((field: any, index: number) => (
                        <div key={index}>{field.fieldType}</div>
                    ))}
                </div>
            ) : (
                !isLoading && <p>No form fields found.</p>
            )}
            <Button className="mt-8 text-md ">Submit<ArrowRight/></Button>
        </main>
    );
}