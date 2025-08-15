import NavBar from "@/components/helpers/NavBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function Layout({children}:{children:React.ReactNode})
{
    return(
        <main>
            <NavBar/>
            {children}
        </main>
    );
}