'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/features/admin/dashboard/dashboard-stats";
import { RecentSchedules, ScheduleItem } from "@/components/features/admin/dashboard/RecentSchedules";
import { UpcomingEvent, UpcomingEventItem } from "@/components/features/admin/dashboard/UpcomingEvent";
import { Total } from "@/components/features/admin/dashboard/Total";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export default function DashboardPage() {
    const { data, isPending } = useQuery({
        queryKey: ["overviews"],
        queryFn: async () => {
            const res = await axiosInstance.get("/admin/dashboard")
            return res.data.data as {
                totalClasses: number
                totalLectures: number
                totalCourses: number
                recentSchedule: ScheduleItem[]
                upcomingEvents: UpcomingEventItem[]
                roomUtilization: { name: string, value: number }[]
            }
        }
    })
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to the university scheduling system dashboard.
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <DashboardStats data={data?.roomUtilization!} isLoading={isPending} />
                    <Total totalClasses={data?.totalClasses!} totalCourses={data?.totalCourses!} totalLectures={data?.totalLectures!} />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <RecentSchedules isLoading={isPending} data={data?.recentSchedule!} />
                        <UpcomingEvent isLoading={isPending} data={data?.upcomingEvents!} />
                    </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-full">
                            <CardHeader>
                                <CardTitle>Analytics Dashboard</CardTitle>
                                <CardDescription>
                                    View detailed statistics about scheduling efficiency.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Analytics will be available in the next update.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}