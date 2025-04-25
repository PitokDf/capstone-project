"use client"

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface ScheduleCalendarViewProps {
    schedules: Schedule[];
}

// Time slots for the calendar
const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Days of the week
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function ScheduleCalendarView({ schedules }: ScheduleCalendarViewProps) {
    const [filterType, setFilterType] = useState<'none' | 'room' | 'lecturer'>('none');
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    // Get unique rooms and lecturers for filters
    const rooms = Array.from(new Set(schedules.map(s => s.roomCode)))
        .map(roomCode => {
            const schedule = schedules.find(s => s.roomCode === roomCode);
            return {
                code: roomCode,
                name: schedule?.roomName || ''
            };
        });

    const lecturers = Array.from(new Set(schedules.map(s => s.lectureName)));

    // Apply filters
    const filteredSchedules = schedules.filter(schedule => {
        if (filterType === 'none') return true;
        if (filterType === 'room') return schedule.roomCode === selectedFilter;
        if (filterType === 'lecturer') return schedule.lectureName === selectedFilter;
        return true;
    });

    // Group schedules by day for the calendar view
    const schedulesByDay = days.reduce((acc, day) => {
        acc[day] = filteredSchedules.filter(schedule => schedule.day === day);
        return acc;
    }, {} as Record<string, Schedule[]>);

    // Function to get schedule at a specific day and time
    const getScheduleAt = (day: string, time: string) => {
        const daySchedules = schedulesByDay[day] || [];
        return daySchedules.find(schedule => {
            const scheduleStartTime = format(schedule.startTime, 'HH:mm');
            const scheduleEndTime = format(schedule.endTime, 'HH:mm');
            return time >= scheduleStartTime && time < scheduleEndTime;
        });
    };

    // Calculate schedule duration in hours
    const getScheduleDuration = (schedule: Schedule) => {
        const startHour = schedule.startTime.getHours();
        const endHour = schedule.endTime.getHours();
        return endHour - startHour;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <Tabs defaultValue="weekly" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="daily" disabled>Daily</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-4">
                    <Select value={filterType} onValueChange={(value: 'none' | 'room' | 'lecturer') => {
                        setFilterType(value);
                        setSelectedFilter('');
                    }}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Filter</SelectItem>
                            <SelectItem value="room">By Room</SelectItem>
                            <SelectItem value="lecturer">By Lecturer</SelectItem>
                        </SelectContent>
                    </Select>

                    {filterType === 'room' && (
                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map(room => (
                                    <SelectItem key={room.code} value={room.code}>
                                        {room.code} - {room.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {filterType === 'lecturer' && (
                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select lecturer" />
                            </SelectTrigger>
                            <SelectContent>
                                {lecturers.map(lecturer => (
                                    <SelectItem key={lecturer} value={lecturer}>
                                        {lecturer}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Calendar View */}
            <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-muted">
                    <div className="p-2 text-center font-medium border-r"></div>
                    {days.map(day => (
                        <div key={day} className="p-3 text-center font-medium border-r last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-[100px_repeat(5,1fr)]">
                    {timeSlots.map(time => (
                        <>
                            <div className="p-2 text-center border-r border-t">
                                {time}
                            </div>
                            {days.map(day => {
                                const schedule = getScheduleAt(day, time);
                                const isFirstHourOfSchedule = schedule &&
                                    format(schedule.startTime, 'HH:mm') === time;

                                // Only render a cell for the first hour of a schedule
                                if (isFirstHourOfSchedule) {
                                    const duration = getScheduleDuration(schedule);
                                    const bgClass = `bg-primary/10 hover:bg-primary/20`;

                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className={`p-2 border-t border-r relative ${bgClass}`}
                                            style={{
                                                gridRow: `span ${duration}`,
                                                minHeight: `${duration * 40}px`
                                            }}
                                        >
                                            <div className="h-full flex flex-col">
                                                <div className="font-medium">{schedule.courseCode}</div>
                                                <div className="text-sm truncate">{schedule.courseName}</div>
                                                <div className="mt-auto text-xs text-muted-foreground">
                                                    <div>{schedule.lectureName}</div>
                                                    <div>{schedule.roomCode}</div>
                                                    <div>{format(schedule.startTime, 'HH:mm')} - {format(schedule.endTime, 'HH:mm')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (!schedule || format(schedule.startTime, 'HH:mm') !== time) {
                                    // Empty cell
                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className="border-t border-r p-2 min-h-[40px]"
                                        ></div>
                                    );
                                }
                                // For cells that are part of a multi-hour schedule but not the first hour,
                                // return null as they're covered by the grid-row-span
                                return null;
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}