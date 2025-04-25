'use client'

import { AppProgressBar, AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import AdminAppBar from "@/components/layouts/AppBar";
import { AppSidebar } from "@/components/layouts/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'nprogress/nprogress.css';

const queryClient = new QueryClient();

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='flex-1 overflow-auto'>

                <AdminAppBar />
                <main className="p-4 md:p-6 max-w-7xl mx-auto">
                    <div className="flex-1 p-4">
                        <AppProgressBar
                            color='#fff'
                            shallowRouting
                            disableStyle={true} />
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}