"use client"
import { Button } from "../ui/button";
import Link from "next/link";
import { authClient } from "@/app/utils/auth-client";
import { useEffect, useState } from "react";
import { Session } from "@/app/utils/types";

export default function NavBar()
{
    const [session,setSession] = useState<Session | undefined>();

    useEffect(() => {
        const fetchSession = async() =>{
            const session = (await authClient.getSession()).data?.session
            setSession(session);
        };
        fetchSession();
    }, [])
    
    const onClickLogout = async() =>{
        if(!session?.token) return;
        await authClient.revokeSession({
            token: session.token
        }).catch((err)=>{
            console.error(`session logout error ${err} in NavBar logout Button`);
        })
        setSession(undefined);
    }

    return(
        <nav className="sticky top-2 bg-emerald-100 w-11/12 place-items-center h-auto px-4 
        py-2 rounded-2xl mx-auto">
            {
                session?
                <Button onClick={onClickLogout}>Log out</Button>
                :
                <Link href={'/Components/Auth/Login'}><Button>Sign In</Button></Link>
            }
            
        </nav>
    );
}