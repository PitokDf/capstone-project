"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Search, CalendarDays, Users, PrinterIcon, DownloadIcon } from "lucide-react";
import { ScheduleCalendarView } from '@/components/features/admin/schedule/schedule-calender-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layouts/Header';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getSchedules } from '@/lib/api/schedule';
import { WeeklySchedule } from '@/components/features/admin/dashboard/WeeklySchedule';
import { getClasses } from '@/lib/api/class';
import { getLectures } from '@/lib/api/lecture';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DailySchedule } from '@/components/features/admin/schedule/DailySchedule';

interface Schedule {
    id: number;
    courseID: number;
    courseName: string;
    courseCode: string;
    lectureID: number;
    lectureName: string;
    roomID: number;
    roomName: string;
    roomCode: string;
    timeSlotID: number;
    day: string;
    startTime: Date;
    endTime: Date;
}

export default function PublicSchedulePage() {
    const [filterType, setFilterType] = useState("all");
    const [filterValue, setFilterValue] = useState("");
    const [viewType, setViewType] = useState<string>('calendar');

    const { data, isPending } = useQuery({
        queryKey: ["schedules"],
        queryFn: getSchedules
    })
    const { data: classes } = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses
    })
    const { data: lecturer } = useQuery({
        queryKey: ["lectures"],
        queryFn: getLectures
    })

    // Get unique rooms for room filter
    const rooms = Array.from(
        new Set(data?.map(s => s.roomID))
    ).map(code => {
        const schedule = data?.find(s => s.roomID === code);
        return {
            code,
            name: schedule?.roomName || ''
        };
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="min-h-screen bg-background">
                <div className="container mx-auto p-4 md:p-6 space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <Label>Filter Type</Label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select filter type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Schedules</SelectItem>
                                            <SelectItem value="class">By Class</SelectItem>
                                            <SelectItem value="lecturer">By Lecturer</SelectItem>
                                            <SelectItem value="room">By Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {filterType !== "all" && (
                                    <div className='space-y-2'>
                                        <Label>
                                            {filterType === "class"
                                                ? "Select Class"
                                                : filterType === "lecturer"
                                                    ? "Select Lecturer"
                                                    : "Select Room"}
                                        </Label>
                                        <Select value={filterValue} onValueChange={setFilterValue}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select ${filterType}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterType === "class" && classes?.map(cls => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                                                ))}
                                                {filterType === "lecturer" && lecturer?.map(lecturer => (
                                                    <SelectItem key={lecturer.id} value={lecturer.id.toString()}>{lecturer.name}</SelectItem>
                                                ))}
                                                {filterType === "room" && rooms.map(room => (
                                                    <SelectItem key={room.code} value={room.code.toString()}>{room.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex gap-2 flex-wrap">
                                <Badge variant="outline" className="bg-primary/10">Current View</Badge>
                                {filterType === "class" && filterValue && (
                                    <Badge>Class: {classes?.find(c => c.id.toString() === filterValue)?.name || filterValue}</Badge>
                                )}
                                {filterType === "lecturer" && filterValue && (
                                    <Badge>Lecturer: {lecturer?.find(l => l.id.toString() === filterValue)?.name || filterValue}</Badge>
                                )}
                                {filterType === "room" && filterValue && (
                                    <Badge>Room: {rooms.find(r => r.code.toString() === filterValue)?.name || filterValue}</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className='overflow-hidden'
                    >
                        <Tabs defaultValue="weekly">
                            <CardHeader className="pb-0">
                                <div className="flex justify-between items-center">
                                    <CardTitle>Schedule View</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <TabsList>
                                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                            <TabsTrigger value="daily">Daily</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="weekly" className="m-0">
                                    <WeeklySchedule filterType={filterType} filterValue={filterValue} />
                                </TabsContent>

                                <TabsContent value="daily" className="m-0">
                                    <ScrollArea className="h-[600px]">
                                        <DailySchedule filterType={filterType} filterValue={filterValue} />
                                    </ScrollArea>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
            </main>
        </div>
    );
}