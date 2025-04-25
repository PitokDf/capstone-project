'use client'

import { Menu, Bell, UserCircle, Sun, Moon, MenuSquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "../ui/sidebar"

export default function AdminAppBar() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Biar gak flicker pas ganti tema
    useEffect(() => setMounted(true), [])

    return (
        <header className="w-full h-16 border-b bg-background px-4 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                {/* <SidebarTrigger ic /> */}
                <SidebarTrigger />
                <span className="text-xl font-bold">Dashboard Admin</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
                {/* Notification with badge */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <Badge className="absolute -top-1 -right-1 text-xs px-1" variant="destructive">3</Badge>
                </Button>
            </div>
        </header>
    )
}
