"use client"

import { useEffect, useState } from 'react';
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
import { LoaderCircle } from 'lucide-react';

type ServerError = {
    path: string;
    msg: string;
}
// Schema for time slot form validation
export const timeSlotSchema = z.object({
    day: z.string().min(1, "Day is required"),
    starTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
}).refine(
    (data) => {
        const start = data.starTime;
        const end = data.endTime;
        return start < end;
    },
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

export type TimeSlotFormValues = z.infer<typeof timeSlotSchema> & { id?: number };

interface TimeSlotDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: TimeSlotFormValues) => Promise<void>;
    title: string;
    defaultValues?: TimeSlotFormValues;
    serverErrors?: ServerError[];
    onLoading: boolean
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
    onLoading,
    serverErrors
}: TimeSlotDialogProps) {

    useEffect(() => {
        if (open && title === "Edit Timeslot" && defaultValues) {
            form.reset({
                day: defaultValues.day,
                starTime: formatTimeForInput(new Date(defaultValues.starTime)),
                endTime: formatTimeForInput(new Date(defaultValues.endTime)),
            });
        }
    }, [open])

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof TimeSlotFormValues).invalid === false) {
                form.setError(e.path as keyof TimeSlotFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])
    // Convert Date objects to string format for the form
    const formatTimeForInput = (date: Date) => {
        return date.toTimeString().substring(0, 5); // Extract HH:MM
    };

    const initialValues: TimeSlotFormValues = defaultValues
        ? {
            day: defaultValues.day,
            starTime: formatTimeForInput(new Date(defaultValues.starTime)),
            endTime: formatTimeForInput(new Date(defaultValues.endTime)),
        }
        : {
            day: "Monday",
            starTime: "08:00",
            endTime: "10:00",
        };

    const form = useForm<TimeSlotFormValues>({
        resolver: zodResolver(timeSlotSchema),
        defaultValues: initialValues,
    });

    const handleSubmit = form.handleSubmit(async data => {

        // Parse time strings to Date objects
        const [startHour, startMinute] = data.starTime.split(':').map(Number);
        const [endHour, endMinute] = data.endTime.split(':').map(Number);

        const baseDate = Date.now();

        const starTime = new Date(baseDate);
        starTime.setHours(startHour, startMinute);
        console.log(starTime);

        const endTime = new Date(baseDate);
        endTime.setHours(endHour, endMinute);

        await onSave(defaultValues?.id
            ? { day: data.day, starTime: starTime.toISOString(), endTime: endTime.toISOString(), id: defaultValues.id }
            : { day: data.day, starTime: starTime.toISOString(), endTime: endTime.toISOString() });

        form.reset()
    })

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
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
                                name="starTime"
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
                            <Button disabled={onLoading} type="submit">Save {onLoading && <LoaderCircle className='animate-spin' />} </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}