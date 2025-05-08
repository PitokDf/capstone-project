'use client'

import { AppProgressBar, AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import AdminAppBar from "@/components/layouts/AppBar";
import { AppSidebar } from "@/components/layouts/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import 'nprogress/nprogress.css';

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
                <main className=" md:p-6 max-w-7xl mx-auto">
                    <div className="flex-1 p-4">
                        <AppProgressBar
                            color='#fff'
                            shallowRouting
                            disableStyle={true} />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}