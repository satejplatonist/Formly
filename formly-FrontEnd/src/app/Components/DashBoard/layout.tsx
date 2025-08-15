import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSideBar from "./AppSideBar";

export default function Layout({children}:{children:React.ReactNode})
{
    return(
        <SidebarProvider>
            <main className="w-full min-h-screen flex overflow-hidden">
               <AppSideBar/>
               <section className="flex-1 overflow-y-auto">
                  <SidebarTrigger/>
                  {children}
               </section>
            </main>
        </SidebarProvider>
    );
}