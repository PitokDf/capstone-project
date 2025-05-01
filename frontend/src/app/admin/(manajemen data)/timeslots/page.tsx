"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { TimeSlotDialog } from '@/components/features/admin/timeslots/TimeSlotDialog';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { format } from 'date-fns';

interface TimeSlot {
    id: number;
    day: string;
    starTime: Date;
    endTime: Date;
}

// Mock data
const initialTimeSlots: TimeSlot[] = [
    {
        id: 1,
        day: "Monday",
        starTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 2,
        day: "Monday",
        starTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 3,
        day: "Tuesday",
        starTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 4,
        day: "Tuesday",
        starTime: new Date(2023, 0, 1, 13, 0),
        endTime: new Date(2023, 0, 1, 15, 0)
    },
    {
        id: 5,
        day: "Wednesday",
        starTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 6,
        day: "Wednesday",
        starTime: new Date(2023, 0, 1, 15, 0),
        endTime: new Date(2023, 0, 1, 17, 0)
    },
    {
        id: 7,
        day: "Thursday",
        starTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 8,
        day: "Friday",
        starTime: new Date(2023, 0, 1, 13, 0),
        endTime: new Date(2023, 0, 1, 15, 0)
    },
];

export default function TimeSlotsPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot | null>(null);

    const filteredTimeSlots = timeSlots.filter(timeSlot =>
        timeSlot.day.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTimeSlot = (timeSlot: Omit<TimeSlot, 'id'>) => {
        const newTimeSlot = {
            ...timeSlot,
            id: Math.max(0, ...timeSlots.map(t => t.id)) + 1
        };
        setTimeSlots([...timeSlots, newTimeSlot]);
        setIsAddDialogOpen(false);
    };

    const handleEditTimeSlot = (updatedTimeSlot: { day: string; starTime: Date; endTime: Date; id?: number }) => {
        if (updatedTimeSlot.id === undefined) return;
        setTimeSlots(timeSlots.map(timeSlot =>
            timeSlot.id === updatedTimeSlot.id ? updatedTimeSlot as TimeSlot : timeSlot
        ));
        setIsEditDialogOpen(false);
        setCurrentTimeSlot(null);
    };

    const handleDeleteTimeSlot = () => {
        if (currentTimeSlot) {
            setTimeSlots(timeSlots.filter(timeSlot => timeSlot.id !== currentTimeSlot.id));
            setIsDeleteDialogOpen(false);
            setCurrentTimeSlot(null);
        }
    };

    const openEditDialog = (timeSlot: TimeSlot) => {
        setCurrentTimeSlot(timeSlot);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (timeSlot: TimeSlot) => {
        setCurrentTimeSlot(timeSlot);
        setIsDeleteDialogOpen(true);
    };

    const formatTime = (date: Date) => {
        return format(date, 'HH:mm');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Time Slot
                </Button>
            </div>

            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by day..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTimeSlots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No time slots found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTimeSlots.map((timeSlot) => {
                                const startTime = formatTime(timeSlot.starTime);
                                const endTime = formatTime(timeSlot.endTime);
                                const durationMs = timeSlot.endTime.getTime() - timeSlot.starTime.getTime();
                                const durationHours = durationMs / (1000 * 60 * 60);

                                return (
                                    <TableRow key={timeSlot.id}>
                                        <TableCell className="font-medium">{timeSlot.day}</TableCell>
                                        <TableCell>{startTime}</TableCell>
                                        <TableCell>{endTime}</TableCell>
                                        <TableCell>{durationHours} hours</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(timeSlot)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteDialog(timeSlot)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <TimeSlotDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleAddTimeSlot}
                title="Add Time Slot"
            />

            {currentTimeSlot && (
                <TimeSlotDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleEditTimeSlot}
                    title="Edit Time Slot"
                    defaultValues={currentTimeSlot}
                />
            )}

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteTimeSlot}
                title="Delete Time Slot"
                description={`Are you sure you want to delete this time slot (${currentTimeSlot?.day}, ${currentTimeSlot ? formatTime(currentTimeSlot.starTime) : ''} - ${currentTimeSlot ? formatTime(currentTimeSlot.endTime) : ''})? This action cannot be undone.`}
            />
        </div>
    );
}