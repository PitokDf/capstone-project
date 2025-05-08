"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";

const qc = new QueryClient()
export function DefaultLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsloading] = useState(true)
    useEffect(() => {
        const handleLoaded = () => setIsloading(false)

        if (document.readyState === "complete" || document.readyState === "interactive") {
            handleLoaded()
        } else {
            window.addEventListener("DOMContentLoaded", handleLoaded)

            return () => {
                window.removeEventListener("DOMContentLoaded", handleLoaded)
            }
        }
    }, [])
    return (
        <>
            <QueryClientProvider client={qc}>
                {isLoading ? (
                    <div className="h-dvh w-dvw flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin" /></div>
                ) :
                    <>
                        {children}
                    </>
                }
            </QueryClientProvider>
            <Toaster position="top-right" duration={4000} />
        </>
    )
}