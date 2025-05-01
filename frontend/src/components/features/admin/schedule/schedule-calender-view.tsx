// "use client"

// import React, { useState } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { format } from 'date-fns';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface Schedule {
//     id: number;
//     courseID: number;
//     courseName: string;
//     courseCode: string;
//     lectureID: number;
//     lectureName: string;
//     roomID: number;
//     roomName: string;
//     roomCode: string;
//     timeSlotID: number;
//     day: string;
//     startTime: Date;
//     endTime: Date;
// }

// interface ScheduleCalendarViewProps {
//     schedules: Schedule[];
// }

// // Time slots for the calendar
// const timeSlots = [
//     "08:00", "09:00", "10:00", "11:00", "12:00",
//     "13:00", "14:00", "15:00", "16:00", "17:00"
// ];

// // Days of the week
// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// export function ScheduleCalendarView({ schedules }: ScheduleCalendarViewProps) {
//     const [filterType, setFilterType] = useState<'none' | 'room' | 'lecturer'>('none');
//     const [selectedFilter, setSelectedFilter] = useState<string>('');

//     // Get unique rooms and lecturers for filters
//     const rooms = Array.from(new Set(schedules.map(s => s.roomCode)))
//         .map(roomCode => {
//             const schedule = schedules.find(s => s.roomCode === roomCode);
//             return {
//                 code: roomCode,
//                 name: schedule?.roomName || ''
//             };
//         });

//     const lecturers = Array.from(new Set(schedules.map(s => s.lectureName)));

//     // Apply filters
//     const filteredSchedules = schedules.filter(schedule => {
//         if (filterType === 'none') return true;
//         if (filterType === 'room') return schedule.roomCode === selectedFilter;
//         if (filterType === 'lecturer') return schedule.lectureName === selectedFilter;
//         return true;
//     });

//     // Group schedules by day for the calendar view
//     const schedulesByDay = days.reduce((acc, day) => {
//         acc[day] = filteredSchedules.filter(schedule => schedule.day === day);
//         return acc;
//     }, {} as Record<string, Schedule[]>);

//     // Function to get schedule at a specific day and time
//     const getScheduleAt = (day: string, time: string) => {
//         const daySchedules = schedulesByDay[day] || [];
//         return daySchedules.find(schedule => {
//             const scheduleStartTime = format(schedule.startTime, 'HH:mm');
//             const scheduleEndTime = format(schedule.endTime, 'HH:mm');
//             return time >= scheduleStartTime && time < scheduleEndTime;
//         });
//     };

//     // Calculate schedule duration in hours
//     const getScheduleDuration = (schedule: Schedule) => {
//         const startHour = schedule.startTime.getHours();
//         const endHour = schedule.endTime.getHours();
//         return endHour - startHour;
//     };

//     return (
//         <div className="space-y-4">
//             <div className="flex flex-col md:flex-row gap-4 justify-between">
//                 <Tabs defaultValue="weekly" className="w-[400px]">
//                     <TabsList>
//                         <TabsTrigger value="weekly">Weekly</TabsTrigger>
//                         <TabsTrigger value="daily" disabled>Daily</TabsTrigger>
//                     </TabsList>
//                 </Tabs>

//                 <div className="flex gap-4">
//                     <Select value={filterType} onValueChange={(value: 'none' | 'room' | 'lecturer') => {
//                         setFilterType(value);
//                         setSelectedFilter('');
//                     }}>
//                         <SelectTrigger className="w-[140px]">
//                             <SelectValue placeholder="Filter by" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="none">No Filter</SelectItem>
//                             <SelectItem value="room">By Room</SelectItem>
//                             <SelectItem value="lecturer">By Lecturer</SelectItem>
//                         </SelectContent>
//                     </Select>

//                     {filterType === 'room' && (
//                         <Select value={selectedFilter} onValueChange={setSelectedFilter}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="Select room" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {rooms.map(room => (
//                                     <SelectItem key={room.code} value={room.code}>
//                                         {room.code} - {room.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     )}

//                     {filterType === 'lecturer' && (
//                         <Select value={selectedFilter} onValueChange={setSelectedFilter}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="Select lecturer" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {lecturers.map(lecturer => (
//                                     <SelectItem key={lecturer} value={lecturer}>
//                                         {lecturer}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     )}
//                 </div>
//             </div>

//             {/* Calendar View */}
//             <div className="border rounded-md overflow-hidden">
//                 <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-muted">
//                     <div className="p-2 text-center font-medium border-r"></div>
//                     {days.map(day => (
//                         <div key={day} className="p-3 text-center font-medium border-r last:border-r-0">
//                             {day}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="grid grid-cols-[100px_repeat(5,1fr)]">
//                     {timeSlots.map(time => (
//                         <React.Fragment key={time}>
//                             <div className="p-2 text-center border-r border-t">
//                                 {time}
//                             </div>
//                             {days.map(day => {
//                                 const schedule = getScheduleAt(day, time);
//                                 const isFirstHourOfSchedule = schedule &&
//                                     format(schedule.startTime, 'HH:mm') === time;

//                                 // Only render a cell for the first hour of a schedule
//                                 if (isFirstHourOfSchedule) {
//                                     const duration = getScheduleDuration(schedule);
//                                     const bgClass = `bg-primary/10 hover:bg-primary/20`;

//                                     return (
//                                         <div
//                                             key={`${day}-${time}`}
//                                             className={`p-2 border-t border-r relative ${bgClass}`}
//                                             style={{
//                                                 gridRow: `span ${duration}`,
//                                                 minHeight: `${duration * 40}px`
//                                             }}
//                                         >
//                                             <div className="h-full flex flex-col">
//                                                 <div className="font-medium">{schedule.courseCode}</div>
//                                                 <div className="text-sm truncate">{schedule.courseName}</div>
//                                                 <div className="mt-auto text-xs text-muted-foreground">
//                                                     <div>{schedule.lectureName}</div>
//                                                     <div>{schedule.roomCode}</div>
//                                                     <div>{format(schedule.startTime, 'HH:mm')} - {format(schedule.endTime, 'HH:mm')}</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 } else if (!schedule || format(schedule.startTime, 'HH:mm') !== time) {
//                                     // Empty cell
//                                     return (
//                                         <div
//                                             key={`${day}-${time}`}
//                                             className="border-t border-r p-2 min-h-[40px]"
//                                         ></div>
//                                     );
//                                 }
//                                 // For cells that are part of a multi-hour schedule but not the first hour,
//                                 // return null as they're covered by the grid-row-span
//                                 return null;
//                             })}
//                         </React.Fragment>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useState, useMemo, Fragment } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import clsx from 'clsx';

interface Schedule {
    id: number;
    courseID: number;
    courseName: string;
    courseCode: string;
    lectureName: string;
    roomCode: string;
    day: string;
    startTime: Date;
    endTime: Date;
}

interface Props {
    schedules: Schedule[];
}

const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Simple color palette
const colors = [
    'bg-blue-400', 'bg-green-400', 'bg-indigo-400', 'bg-pink-400', 'bg-yellow-400',
];

export function ScheduleCalendarView({ schedules }: Props) {
    const [view, setView] = useState<'weekly' | 'daily'>('weekly');
    const [filterType, setFilterType] = useState<'none' | 'room' | 'lecturer'>('none');
    const [filterValue, setFilterValue] = useState<string>('');

    // derive filter options
    const rooms = useMemo(() => Array.from(new Set(schedules.map(s => s.roomCode))), [schedules]);
    const lecturers = useMemo(() => Array.from(new Set(schedules.map(s => s.lectureName))), [schedules]);

    // filtered list
    const filtered = useMemo(() => {
        return schedules.filter(s => {
            if (filterType === 'room') return s.roomCode === filterValue;
            if (filterType === 'lecturer') return s.lectureName === filterValue;
            return true;
        });
    }, [schedules, filterType, filterValue]);

    // group by day
    const byDay = useMemo(() => {
        return days.reduce((acc, day) => {
            acc[day] = filtered.filter(s => s.day === day);
            return acc;
        }, {} as Record<string, Schedule[]>);
    }, [filtered]);

    const getSlot = (day: string, time: string) => {
        return byDay[day]?.find(s => {
            const start = format(s.startTime, 'HH:mm');
            const end = format(s.endTime, 'HH:mm');
            return time >= start && time < end;
        });
    };

    const getDuration = (s: Schedule) => s.endTime.getHours() - s.startTime.getHours();

    // map courseID to color
    const courseColors = useMemo(() => {
        const map = new Map<number, string>();
        filtered.forEach((s, idx) => {
            if (!map.has(s.courseID)) {
                map.set(s.courseID, colors[idx % colors.length]);
            }
        });
        return map;
    }, [filtered]);

    return (
        <Card className="overflow-auto">
            <CardContent className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-2">
                    {Array.from(courseColors.entries()).map(([id, colorClass]) => {
                        const course = filtered.find(s => s.courseID === id);
                        return (
                            <div key={id} className="flex items-center gap-1">
                                <span className={clsx(colorClass, 'w-4 h-4 rounded')}></span>
                                <span className="text-sm">{course?.courseCode}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Tabs value={view} onValueChange={(value) => setView(value as 'weekly' | 'daily')} className="w-max">
                        <TabsList>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="daily">Daily</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex items-center gap-3">
                        <Select value={filterType} onValueChange={v => { setFilterType(v as any); setFilterValue(''); }}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="room">Room</SelectItem>
                                <SelectItem value="lecturer">Lecturer</SelectItem>
                            </SelectContent>
                        </Select>
                        {filterType === 'room' && (
                            <Select value={filterValue} onValueChange={setFilterValue}>
                                <SelectTrigger className="w-48"><SelectValue placeholder="Select room" /></SelectTrigger>
                                <SelectContent>{rooms.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                        )}
                        {filterType === 'lecturer' && (
                            <Select value={filterValue} onValueChange={setFilterValue}>
                                <SelectTrigger className="w-48"><SelectValue placeholder="Select lecturer" /></SelectTrigger>
                                <SelectContent>{lecturers.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                {/* Calendar */}
                {view === 'weekly' ? (
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                            <tr>
                                <th className="w-24 border p-1"></th>
                                {days.map(day => (
                                    <th key={day} className="border p-1 text-center font-medium">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(time => {
                                return (
                                    <tr key={time}>
                                        <th className="border p-1 sticky left-0 bg-background text-right pr-2">{time}</th>
                                        {days.map(day => {
                                            const slot = getSlot(day, time);
                                            const isStart = slot && format(slot.startTime, 'HH:mm') === time;
                                            if (isStart) {
                                                const span = getDuration(slot!);
                                                return (
                                                    <td
                                                        key={`${day}-${time}`}
                                                        rowSpan={span}
                                                        className={clsx('border p-1 text-white relative', courseColors.get(slot!.courseID))}
                                                        tabIndex={0}
                                                        aria-label={`${slot!.courseCode} ${slot!.courseName} at ${format(slot!.startTime, 'HH:mm')}`}
                                                    >
                                                        <div className="truncate font-semibold">{slot!.courseCode}</div>
                                                        <Tooltip>
                                                            <div className="text-sm">
                                                                <strong>{slot!.courseCode}</strong>
                                                                <div>{slot!.courseName}</div>
                                                                <div>{slot!.lectureName}</div>
                                                                <div>{slot!.roomCode}</div>
                                                            </div>
                                                            <button className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-white/75"></button>
                                                        </Tooltip>
                                                    </td>
                                                );
                                            }
                                            if (!slot) {
                                                return <td key={`${day}-${time}`} className="border h-10 p-0"></td>;
                                            }
                                            return null;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="space-y-4">
                        {days.map(day => (
                            <div key={day}>
                                <h3 className="font-semibold mb-2">{day}</h3>
                                <div className="border rounded-md">
                                    {byDay[day]?.length ? byDay[day]!.map(slot => (
                                        <div key={slot.id} className="p-3 border-b last:border-b-0 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/20">
                                            <div>
                                                <div className="font-semibold">{format(slot.startTime, 'HH:mm')} - {format(slot.endTime, 'HH:mm')}</div>
                                                <div className="truncate">{slot.courseCode} • {slot.courseName}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {slot.roomCode} • {slot.lectureName}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-3 text-center text-muted-foreground">No classes</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
