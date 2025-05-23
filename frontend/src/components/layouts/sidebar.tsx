'use client'

import { Home, Users, MapPin, Clock, ClipboardListIcon, GraduationCap, CalendarIcon } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import LogOutButton from "../features/auth/LogoutButton"
import ThemeToggle from "../ThemeToggle"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"

const items = [
    { title: "Overview", url: "/admin", icon: Home },
    { title: "Classes", url: "/admin/classes", icon: Users },
    { title: "Courses", url: "/admin/courses", icon: ClipboardListIcon },
    { title: "Lectures", url: "/admin/lectures", icon: GraduationCap },
    { title: "Rooms", url: "/admin/rooms", icon: MapPin },
    { title: "Time Slots", url: "/admin/timeslots", icon: Clock },
    { title: "Schedules", url: "/admin/schedules", icon: CalendarIcon },
]


export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [loadingPath, setLoadingPath] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const NavItem = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => {
        const isActive = pathname === href;
        const isLoading = isPending && loadingPath === href

        return (
            <button
                onClick={() => {
                    setLoadingPath(href)
                    startTransition(() => router.push(href))
                }}
                className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10 text-foreground"
                )}
            >
                {icon}
                <span>{label}</span>
                {isLoading && <Spinner />}
            </button>
        )
    }


    return (
        <Sidebar variant="sidebar">
            <SidebarHeader className="p-4">
                <div className="flex text-blue-500 items-center gap-2">
                    <GraduationCap className="h-6 w-6" />
                    <span className="font-bold text-xl text-primary">University Scheduler</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild >
                                    <NavItem
                                        href={item.url}
                                        icon={<item.icon className="h-5 w-5" />}
                                        label={item.title}
                                    />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">Admin Panel</span>
                    <ThemeToggle />
                </div>
                <LogOutButton />
            </SidebarFooter>
        </Sidebar>
    )
}


const Spinner = () => (
    <div className="ml-auto h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
)