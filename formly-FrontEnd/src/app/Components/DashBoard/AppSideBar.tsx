import { auth } from "@/app/utils/auth";
import Logout from "@/components/helpers/Logout";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Binoculars, House, Settings, Trash2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";


export default async function AppSideBar()
{
    const session = await auth.api.getSession({
        headers: await headers() 
    })

    const imgUrl = session?.user.image;
    const userName = session?.user.name

    if(!imgUrl || !userName)
    {
        throw new Error("User Image or name not found");
    }

    return(
        <Sidebar className="px-4 bg-zinc-50">
            <SidebarHeader className="">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center justify-baseline select-none gap-x-2">
                        <Image
                            src= {imgUrl}
                            width={30}
                            height={30}
                            alt="Picture of the author"
                            className="rounded-full mt-1 ring-1 ring-zinc-500 p-0.5 pointer-events-none"
                        />
                        <h1>{userName}</h1>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Logout/>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href={"/Components/DashBoard/Home"}>
                                    <SidebarMenuButton>
                                        <House/>Home
                                    </SidebarMenuButton>
                                </Link>
                                <SidebarMenuButton>
                                    <Binoculars/>Search
                                </SidebarMenuButton>
                                <SidebarMenuButton>
                                    <Settings />Settings
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-md font-bold tracking-wide">Workspace</SidebarGroupLabel>
                    
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Trash2/>Trash
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                 </SidebarGroup>   
            </SidebarContent>
        </Sidebar>
    );
}