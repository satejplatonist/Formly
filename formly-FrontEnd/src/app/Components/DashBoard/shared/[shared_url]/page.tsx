"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { use } from "react"
import { toast, Toaster } from "sonner";

type ShareUrl = {
    shared_url: string
}

export default function ShareLink({params}:{params: Promise<ShareUrl>}) 
{
    const resolvedParams = use(params);
    const shared_url = resolvedParams.shared_url;

    return(
        <main className="min-h-screen w-full flex flex-col items-center justify-center">
            <Card className="min-w-5/6 lg:min-w-3/6">
                <CardHeader className="text-center">
                    <h1 className="text-xl">🎊🎉 Form Published 🎉🎊</h1>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-center gap-x-2">
                    <div>http://localhost:3000/Components/Submissions/{shared_url}</div>
                    <Button onClick={()=>{
                        navigator.clipboard.writeText(`http://localhost:3000/Components/Submissions/${shared_url}`)
                        .then(() => {
                        toast.success("URL Copied!", {
                            description: `http://localhost:3000/Components/Submissions/${shared_url}`,
                        });
      })
      .catch(() => {
        toast.error("Failed to copy the URL.");
      });
                    }}>
                        Copy
                    </Button>
                </CardContent>
            </Card>
            <Toaster position="bottom-center" richColors/>
        </main>
    );
}