"use client"

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data for dropdowns
const courses = [
    { id: 1, code: "CS101", name: "Introduction to Computer Science" },
    { id: 2, code: "MATH201", name: "Calculus I" },
    { id: 3, code: "ENG101", name: "Academic Writing" },
    { id: 4, code: "PHYS101", name: "Physics I" },
    { id: 5, code: "CHEM101", name: "General Chemistry" },
    { id: 6, code: "BIO101", name: "Biology Fundamentals" },
];

const lecturers = [
    { id: 1, name: "Dr. Alan Turing" },
    { id: 2, name: "Dr. Ada Lovelace" },
    { id: 3, name: "Prof. John von Neumann" },
    { id: 4, name: "Dr. Grace Hopper" },
    { id: 5, name: "Prof. Tim Berners-Lee" },
    { id: 6, name: "Dr. Margaret Hamilton" },
];

const rooms = [
    { id: 1, code: "R101", name: "Lecture Hall 1" },
    { id: 2, code: "R102", name: "Lecture Hall 2" },
    { id: 3, code: "R201", name: "Classroom 201" },
    { id: 4, code: "R202", name: "Classroom 202" },
    { id: 5, code: "R301", name: "Computer Lab 1" },
    { id: 6, code: "R302", name: "Computer Lab 2" },
];

const timeSlots = [
    {
        id: 1,
        day: "Monday",
        startTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 2,
        day: "Monday",
        startTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 3,
        day: "Tuesday",
        startTime: new Date(2023, 0, 1, 8, 0),
        endTime: new Date(2023, 0, 1, 10, 0)
    },
    {
        id: 4,
        day: "Tuesday",
        startTime: new Date(2023, 0, 1, 13, 0),
        endTime: new Date(2023, 0, 1, 15, 0)
    },
    {
        id: 5,
        day: "Wednesday",
        startTime: new Date(2023, 0, 1, 10, 0),
        endTime: new Date(2023, 0, 1, 12, 0)
    },
    {
        id: 6,
        day: "Wednesday",
        startTime: new Date(2023, 0, 1, 15, 0),
        endTime: new Date(2023, 0, 1, 17, 0)
    },
];

// Schema for schedule form validation
const scheduleSchema = z.object({
    courseID: z.string().min(1, "Course is required"),
    lectureID: z.string().min(1, "Lecturer is required"),
    roomID: z.string().min(1, "Room is required"),
    timeSlotID: z.string().min(1, "Time slot is required"),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => void;
    title: string;
    defaultValues?: any;
}

export function ScheduleDialog({
    open,
    onOpenChange,
    onSave,
    title,
    defaultValues,
}: ScheduleDialogProps) {
    const formatTimeSlot = (timeSlot: any) => {
        const day = timeSlot.day;
        const startTime = timeSlot.startTime.toTimeString().substring(0, 5);
        const endTime = timeSlot.endTime.toTimeString().substring(0, 5);
        return `${day}, ${startTime} - ${endTime}`;
    };

    const initialValues: ScheduleFormValues = defaultValues
        ? {
            courseID: defaultValues.courseID.toString(),
            lectureID: defaultValues.lectureID.toString(),
            roomID: defaultValues.roomID.toString(),
            timeSlotID: defaultValues.timeSlotID.toString(),
        }
        : {
            courseID: "",
            lectureID: "",
            roomID: "",
            timeSlotID: "",
        };

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: initialValues,
    });

    const handleSubmit = (data: ScheduleFormValues) => {
        const courseID = parseInt(data.courseID);
        const course = courses.find(c => c.id === courseID);

        const lectureID = parseInt(data.lectureID);
        const lecturer = lecturers.find(l => l.id === lectureID);

        const roomID = parseInt(data.roomID);
        const room = rooms.find(r => r.id === roomID);

        const timeSlotID = parseInt(data.timeSlotID);
        const timeSlot = timeSlots.find(t => t.id === timeSlotID);

        if (!course || !lecturer || !room || !timeSlot) return;

        const schedule = {
            courseID,
            courseCode: course.code,
            courseName: course.name,
            lectureID,
            lectureName: lecturer.name,
            roomID,
            roomCode: room.code,
            roomName: room.name,
            timeSlotID,
            day: timeSlot.day,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
        };

        // If we're editing, preserve the ID
        if (defaultValues?.id) {
            onSave({ ...schedule, id: defaultValues.id });
        } else {
            onSave(schedule);
        }

        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the schedule below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="courseID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id.toString()}>
                                                    {course.code} - {course.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lectureID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lecturer</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a lecturer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {lecturers.map((lecturer) => (
                                                <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                                    {lecturer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="roomID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a room" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.id} value={room.id.toString()}>
                                                    {room.code} - {room.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timeSlotID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time Slot</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a time slot" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {timeSlots.map((timeSlot) => (
                                                <SelectItem key={timeSlot.id} value={timeSlot.id.toString()}>
                                                    {formatTimeSlot(timeSlot)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}