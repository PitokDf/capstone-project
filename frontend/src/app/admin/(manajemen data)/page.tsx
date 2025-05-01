'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/features/admin/dashboard/Overview";
import { RecentSchedules } from "@/components/features/admin/dashboard/RecentSchedules";
import { ResourceSummary } from "@/components/features/admin/dashboard/ResourceSummary";

export default function DashboardPage() {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to the course scheduling system administration panel.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <ResourceSummary
                            title="Total Courses"
                            value="24"
                            description="+4 from last semester"
                            trend="increase"
                        />
                        <ResourceSummary
                            title="Active Lecturers"
                            value="18"
                            description="2 on sabbatical"
                            trend="neutral"
                        />
                        <ResourceSummary
                            title="Available Rooms"
                            value="32"
                            description="65% utilization rate"
                            trend="decrease"
                        />
                        <ResourceSummary
                            title="Scheduled Classes"
                            value="128"
                            description="12 pending allocation"
                            trend="increase"
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-7 lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Schedule Overview</CardTitle>
                                <CardDescription>
                                    Schedule distribution across the week
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview />
                            </CardContent>
                        </Card>
                        <Card className="col-span-7 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Updates</CardTitle>
                                <CardDescription>
                                    Recently modified schedules
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSchedules />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resource Utilization</CardTitle>
                            <CardDescription>
                                Detailed analytics of resource usage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <p className="text-sm text-muted-foreground">Analytics content coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}