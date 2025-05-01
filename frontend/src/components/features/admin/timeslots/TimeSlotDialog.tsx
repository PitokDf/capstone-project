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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Schema for time slot form validation
const timeSlotSchema = z.object({
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
}).refine(
    (data) => {
        const start = data.startTime;
        const end = data.endTime;
        return start < end;
    },
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;

interface TimeSlotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: { day: string; starTime: Date; endTime: Date; id?: number }) => void;
    title: string;
    defaultValues?: { id?: number; day: string; starTime: Date; endTime: Date };
}

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export function TimeSlotDialog({
    open,
    onOpenChange,
    onSave,
    title,
    defaultValues,
}: TimeSlotDialogProps) {
    // Convert Date objects to string format for the form
    const formatTimeForInput = (date: Date) => {
        return date.toTimeString().substring(0, 5); // Extract HH:MM
    };

    const initialValues: TimeSlotFormValues = defaultValues
        ? {
            day: defaultValues.day,
            startTime: formatTimeForInput(defaultValues.starTime),
            endTime: formatTimeForInput(defaultValues.endTime),
        }
        : {
            day: "Monday",
            startTime: "08:00",
            endTime: "10:00",
        };

    const form = useForm<TimeSlotFormValues>({
        resolver: zodResolver(timeSlotSchema),
        defaultValues: initialValues,
    });

    const handleSubmit = (data: TimeSlotFormValues) => {
        // Parse time strings to Date objects
        const [startHour, startMinute] = data.startTime.split(':').map(Number);
        const [endHour, endMinute] = data.endTime.split(':').map(Number);

        const baseDate = new Date(2023, 0, 1); // January 1, 2023

        const starTime = new Date(baseDate);
        starTime.setHours(startHour, startMinute);

        const endTime = new Date(baseDate);
        endTime.setHours(endHour, endMinute);

        // If we're editing, preserve the ID
        if (defaultValues?.id) {
            onSave({ day: data.day, starTime, endTime, id: defaultValues.id });
        } else {
            onSave({ day: data.day, starTime, endTime });
        }
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the time slot below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        autoComplete='true'
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full' >
                                                <SelectValue placeholder="Select a day" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            {days.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
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