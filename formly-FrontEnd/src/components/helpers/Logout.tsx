"use client"
import { authClient } from "@/app/utils/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Logout() 
{
    const router = useRouter();
    async function logout() 
    {
        const session = (await authClient.getSession()).data?.session
        if(!session?.token) return;
        await authClient.revokeSession({
            token: session.token
        }).catch((err)=>{
            console.error(`session logout error ${err} in NavBar logout Button`);
        })
        router.push('/');
    }

    return(
        <Button size={"lg"} 
            variant={"destructive"}
            onClick={logout}>
                Logout
        </Button>
    );  
};
