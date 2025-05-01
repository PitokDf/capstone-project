"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, FileCog, CalendarDays, Wand2 } from "lucide-react";
import { ScheduleDialog } from '@/components/features/admin/schedule/ScheduleDialog';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { format } from 'date-fns';
import { ScheduleCalendarView } from '@/components/features/admin/schedule/schedule-calender-view';
import { ScheduleGenerator } from '@/lib/schedule-generator';
import { toast } from 'sonner';

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

const initialSchedules: Schedule[] = [
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

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('list');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const filteredSchedules = schedules.filter(schedule =>
        schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.lectureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.day.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSchedule = (schedule: Omit<Schedule, 'id'>) => {
        const newSchedule = {
            ...schedule,
            id: Math.max(0, ...schedules.map(s => s.id)) + 1
        };
        setSchedules([...schedules, newSchedule]);
        setIsAddDialogOpen(false);
    };

    const handleEditSchedule = (updatedSchedule: Schedule) => {
        setSchedules(schedules.map(schedule =>
            schedule.id === updatedSchedule.id ? updatedSchedule : schedule
        ));
        setIsEditDialogOpen(false);
        setCurrentSchedule(null);
    };

    const handleDeleteSchedule = () => {
        if (currentSchedule) {
            setSchedules(schedules.filter(schedule => schedule.id !== currentSchedule.id));
            setIsDeleteDialogOpen(false);
            setCurrentSchedule(null);
        }
    };

    const openEditDialog = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsDeleteDialogOpen(true);
    };

    // const handleGenerateSchedules = async () => {
    //     try {
    //         setIsGenerating(true);

    //         // // In a real app, fetch this data from your API
    //         // const generator = new ScheduleGenerator(
    //         //     courses,
    //         //     lecturers,
    //         //     rooms,
    //         //     timeSlots
    //         // );

    //         const newSchedules = generator.generate();

    //         // Convert generated assignments to schedule format
    //         const generatedSchedules = newSchedules.map((assignment, index) => ({
    //             id: Math.max(...schedules.map(s => s.id)) + index + 1,
    //             courseID: assignment.course.id,
    //             courseName: assignment.course.name,
    //             courseCode: assignment.course.code,
    //             lectureID: assignment.lecture.id,
    //             lectureName: assignment.lecture.name,
    //             roomID: assignment.room.id,
    //             roomName: assignment.room.name,
    //             roomCode: assignment.room.code,
    //             timeSlotID: assignment.timeSlot.id,
    //             day: assignment.timeSlot.day,
    //             startTime: assignment.timeSlot.starTime,
    //             endTime: assignment.timeSlot.endTime,
    //         }));

    //         setSchedules(generatedSchedules);

    //         toast({
    //             title: "Success",
    //             description: "New schedule generated successfully!",
    //         });
    //     } catch (error) {
    //         toast({
    //             title: "Error",
    //             description: "Failed to generate schedule. Please try again.",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setIsGenerating(false);
    //     }
    // };

    const formatTime = (date: Date) => {
        return format(date, 'HH:mm');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => { setIsGenerating(true) }}
                        disabled={isGenerating}
                    >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate Schedule"}
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Schedule
                    </Button>
                </div>
            </div>

            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search schedules..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="list">
                        <FileCog className="mr-2 h-4 w-4" />
                        List View
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Calendar View
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Lecturer</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSchedules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No schedules found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSchedules.map((schedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{schedule.courseCode}</div>
                                                    <div className="text-sm text-muted-foreground">{schedule.courseName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{schedule.lectureName}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div>{schedule.roomCode}</div>
                                                    <div className="text-sm text-muted-foreground">{schedule.roomName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{schedule.day}</TableCell>
                                            <TableCell>
                                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(schedule)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(schedule)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="calendar">
                    <ScheduleCalendarView schedules={filteredSchedules} />
                </TabsContent>
            </Tabs>

            <ScheduleDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleAddSchedule}
                title="Add Schedule"
            />

            {currentSchedule && (
                <ScheduleDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleEditSchedule}
                    title="Edit Schedule"
                    defaultValues={currentSchedule}
                />
            )}

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteSchedule}
                title="Delete Schedule"
                description={`Are you sure you want to delete the schedule for ${currentSchedule?.courseCode} (${currentSchedule?.courseName})? This action cannot be undone.`}
            />
        </div>
    );
}