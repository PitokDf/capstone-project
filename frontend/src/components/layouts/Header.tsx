'use client'

import { useState } from "react"
import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "../ThemeToggle"
import { usePathname } from "next/navigation"
import { LogoImage } from "../images/Logo"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathName = usePathname()

    return (
        <header className="border-b bg-card">
            <div className="container max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">University Scheduler</h1>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">Home</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/schedule">View Schedule</Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/admin">Admin Portal</Link>
                        </Button>
                        <ThemeToggle />
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="flex flex-col gap-2 mt-4 md:hidden">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">Home</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/schedule">View Schedule</Link>
                        </Button>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/admin">Admin Portal</Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}
