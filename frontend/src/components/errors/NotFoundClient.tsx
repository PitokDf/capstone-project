'use client'

import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"
import Link from "next/link"


export default function NotFoundClient() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="bg-muted p-4 rounded-full shadow-lg">
                    <Ghost className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Oops! Halaman nggak ketemu</h1>
                <p className="text-muted-foreground max-w-md">
                    Kayaknya halaman yang elo cari udah pindah, dihapus, atau nggak pernah ada 😢
                </p>
                <Button asChild className="mt-4">
                    <Link href="/">Balik ke Beranda</Link>
                </Button>
            </div>
        </div>
    )
}
