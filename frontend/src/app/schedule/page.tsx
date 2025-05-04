"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Search, CalendarDays, Users } from "lucide-react";
import { ScheduleCalendarView } from '@/components/features/admin/schedule/schedule-calender-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layouts/Header';

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

// Mock data
const schedules: Schedule[] = [
    {
        id: 1,
        courseID: 1,
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        lectureID: 1,
        lectureName: "Dr. Alan Turing",
        roomID: 1,
        roomCode: "R101",
        roomName: "Lecture Hall 1",
        timeSlotID: 1,
        day: "Monday",
        startTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 2,
        courseID: 2,
        courseCode: "MATH201",
        courseName: "Calculus I",
        lectureID: 2,
        lectureName: "Dr. Ada Lovelace",
        roomID: 2,
        roomCode: "R102",
        roomName: "Lecture Hall 2",
        timeSlotID: 2,
        day: "Monday",
        startTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 3,
        courseID: 3,
        courseCode: "ENG101",
        courseName: "Academic Writing",
        lectureID: 3,
        lectureName: "Prof. John von Neumann",
        roomID: 3,
        roomCode: "R201",
        roomName: "Classroom 201",
        timeSlotID: 3,
        day: "Tuesday",
        startTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 4,
        courseID: 4,
        courseCode: "PHYS101",
        courseName: "Physics I",
        lectureID: 4,
        lectureName: "Dr. Grace Hopper",
        roomID: 4,
        roomCode: "R202",
        roomName: "Classroom 202",
        timeSlotID: 4,
        day: "Tuesday",
        startTime: new Date(2023, 0, 1, 13, 0),
        endTime: new Date(2023, 0, 1, 15, 0)
    },
    {
        id: 5,
        courseID: 5,
        courseCode: "CHEM101",
        courseName: "General Chemistry",
        lectureID: 5,
        lectureName: "Prof. Tim Berners-Lee",
        roomID: 5,
        roomCode: "R301",
        roomName: "Computer Lab 1",
        timeSlotID: 5,
        day: "Wednesday",
        startTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 6,
        courseID: 6,
        courseCode: "BIO101",
        courseName: "Biology Fundamentals",
        lectureID: 6,
        lectureName: "Dr. Margaret Hamilton",
        roomID: 6,
        roomCode: "R302",
        roomName: "Computer Lab 2",
        timeSlotID: 6,
        day: "Wednesday",
        startTime: new Date(2023, 0, 1, 15, 0),
        endTime: new Date(2023, 0, 1, 17, 0)
    },
];

export default function PublicSchedulePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const [viewType, setViewType] = useState<string>('calendar');

    // Get unique departments (based on course codes) for department filter
    const departments = Array.from(
        new Set(schedules.map(s => s.courseCode.slice(0, 2)))
    ).map(code => ({
        code,
        name: getDepartmentName(code),
    }));

    // Get unique lecturers for lecturer filter
    const lecturers = Array.from(
        new Set(schedules.map(s => s.lectureName))
    );

    // Get unique rooms for room filter
    const rooms = Array.from(
        new Set(schedules.map(s => s.roomCode))
    ).map(code => {
        const schedule = schedules.find(s => s.roomCode === code);
        return {
            code,
            name: schedule?.roomName || ''
        };
    });

    // Filter schedules based on search term and selected filters
    const filteredSchedules = schedules.filter(schedule => {
        // First apply search term
        const matchesSearch =
            schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.lectureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.day.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Then apply filters
        if (filterType === 'department') {
            return schedule.courseCode.startsWith(selectedFilter);
        } else if (filterType === 'lecturer') {
            return schedule.lectureName === selectedFilter;
        } else if (filterType === 'room') {
            return schedule.roomCode === selectedFilter;
        }

        return true;
    });

    // Helper function to get department name from code
    function getDepartmentName(code: string): string {
        const departmentMap: Record<string, string> = {
            'CS': 'Computer Science',
            'MA': 'Mathematics',
            'EN': 'English',
            'PH': 'Physics',
            'CH': 'Chemistry',
            'BI': 'Biology',
        };
        return departmentMap[code] || code;
    }

    // Format time for display
    const formatTime = (date: Date) => {
        return format(date, 'HH:mm');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Course Schedule</h1>
                        <p className="text-muted-foreground">
                            View and explore the current semester schedule
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={viewType === 'calendar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewType('calendar')}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Calendar View
                        </Button>
                        <Button
                            variant={viewType === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewType('list')}
                        >
                            <Clock className="h-4 w-4 mr-2" />
                            List View
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                            <CardDescription>Narrow down the schedule</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search courses, lecturers..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Filter Type</label>
                                <Select
                                    value={filterType}
                                    onValueChange={(value) => {
                                        setFilterType(value);
                                        setSelectedFilter('');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select filter type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Schedules</SelectItem>
                                        <SelectItem value="department">By Department</SelectItem>
                                        <SelectItem value="lecturer">By Lecturer</SelectItem>
                                        <SelectItem value="room">By Room</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {filterType === 'department' && departments.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => (
                                                <SelectItem key={dept.code} value={dept.code}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {filterType === 'lecturer' && lecturers.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lecturer</label>
                                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                        <SelectTrigger>
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
                                </div>
                            )}

                            {filterType === 'room' && rooms.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Room</label>
                                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                        <SelectTrigger>
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
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterType('all');
                                    setSelectedFilter('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Schedule content */}
                    <div>
                        {viewType === 'calendar' ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weekly Schedule</CardTitle>
                                    <CardDescription>
                                        {filteredSchedules.length === 0
                                            ? "No schedules match your filters"
                                            : `Showing ${filteredSchedules.length} schedule items`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScheduleCalendarView schedules={filteredSchedules} />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Schedule List</CardTitle>
                                    <CardDescription>
                                        {filteredSchedules.length === 0
                                            ? "No schedules match your filters"
                                            : `Showing ${filteredSchedules.length} schedule items`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredSchedules.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No schedules found matching your criteria
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredSchedules.map(schedule => (
                                                <div
                                                    key={schedule.id}
                                                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{schedule.courseCode} - {schedule.courseName}</h3>
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{schedule.lectureName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{schedule.day}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md text-sm">
                                                            <span>{schedule.roomCode} - {schedule.roomName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}