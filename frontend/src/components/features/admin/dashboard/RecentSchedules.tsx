'use client'

import { CalendarDays, Users, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ScheduleItem {
    id: number;
    courseCode: string;
    courseName: string;
    lecturer: string;
    room: string;
    day: string;
    time: string;
    updated: string;
}

export function RecentSchedules({
    isLoading = true, data
}: {
    isLoading: boolean;
    data: ScheduleItem[]
}) {

    return (
        <Card className="col-span-full lg:col-span-4">
            <CardHeader>
                <CardTitle>Recent Schedules</CardTitle>
                <CardDescription>
                    Recently created and modified schedules.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <RecentScheduleSkeleton />
                ) : (
                    <div className="space-y-8">
                        {data.map((schedule) => (
                            <div key={schedule.id} className="flex gap-4 items-start">
                                <div className="rounded-full p-2 bg-primary/10">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        <span className="font-bold">{schedule.courseCode}</span> - {schedule.courseName}
                                    </p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>{schedule.lecturer}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>{schedule.room}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-3 w-3" />
                                            <span>{schedule.day}, {schedule.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                    Updated {schedule.updated}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const RecentScheduleSkeleton = () => {
    return (
        <div className="space-y-8">
            {
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <Skeleton className="w-10 h-9 rounded-full" />
                        <div className="flex justify-between w-full">
                            <div className="space-y-1 max-w-md">
                                <Skeleton className="w-full h-5" />
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="w-[50px] h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="w-[50px] h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="w-[50px] h-4" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="w-[80px] h-5" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}