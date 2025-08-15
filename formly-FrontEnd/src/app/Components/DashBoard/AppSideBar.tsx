import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Binoculars, House, Settings, Trash2 } from "lucide-react";
import Link from "next/link";


export default function AppSideBar()
{
    return(
        <Sidebar className="px-4 bg-zinc-50">
            <SidebarHeader></SidebarHeader>
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