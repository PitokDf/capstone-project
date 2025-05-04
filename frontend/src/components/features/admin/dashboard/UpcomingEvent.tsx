import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Command } from "lucide-react";

export type UpcomingEventItem = {
    title: string,
    time: string,
    lecturer: string,
    room: string
}

export function UpcomingEvent(
    {
        isLoading = true,
        data
    }: {
        isLoading: boolean;
        data: UpcomingEventItem[]
    }
) {
    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                    Class events happening today and tomorrow.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    isLoading ? (
                        <UpcomingEventSkeleton />
                    ) :
                        (
                            <>
                                {data.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.map((event, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <Command />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.time} • {event.lecturer} • {event.room}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                ) : (
                                    <div className="flex w-full h-[200px] justify-center items-center">
                                        <p className="text-center text-muted-foreground">
                                            Dont have upcoming event.
                                        </p>
                                    </div>
                                )}
                            </>
                        )
                }
            </CardContent>
        </Card>
    )
}

function UpcomingEventSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full">
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="w-[150px] h-5" />
                        <Skeleton className="w-[200px] h-5" />
                    </div>
                </div>
            ))}
        </div>
    )
}