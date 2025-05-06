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
import { SelectOptionCourse } from '../SelectOptionCourse';
import { SelectOptionLecture } from '../SelectOptionLectures';
import { SelectOptionRoom } from '../SelectOptionRoom';
import { SelectOptionTimeslot } from '../SelectOptionTimeslots';
import { SelectOptionClass } from '../SelectOptionClass';
import { useApplyServerErrors } from '@/hooks/UseApplyServerErrors';
import { LoaderCircle } from 'lucide-react';

// Schema for schedule form validation
const scheduleSchema = z.object({
    courseID: z.string().min(1, "Course is required"),
    lectureID: z.string().min(1, "Lecturer is required"),
    roomID: z.string().min(1, "Room is required"),
    timeSlotID: z.string().min(1, "Time slot is required"),
    classID: z.string().min(1, "Class is required")
});

type ScheduleFormValues = z.infer<typeof scheduleSchema> & { id?: number };
interface ServerError { path: keyof ScheduleFormValues; msg: string }

interface ScheduleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: ScheduleFormValues) => Promise<void>;
    title: string;
    defaultValues?: any;
    serverErrors?: ServerError[];
    onLoading: boolean;
}

export function ScheduleDialog({
    open,
    onOpenChange,
    onSave,
    title,
    defaultValues,
    onLoading,
    serverErrors
}: ScheduleDialogProps) {
    const initialValues: ScheduleFormValues = defaultValues
        ? {
            courseID: defaultValues.courseID.toString(),
            lectureID: defaultValues.lectureID.toString(),
            roomID: defaultValues.roomID.toString(),
            timeSlotID: defaultValues.timeSlotID.toString(),
            classID: defaultValues.classID.toString()
        }
        : {
            courseID: "",
            lectureID: "",
            roomID: "",
            timeSlotID: "",
            classID: ""
        };

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: initialValues,
    });

    useEffect(() => {
        if (open && title === "Edit Schedule") form.reset(initialValues);
    }, [open]);

    useApplyServerErrors(form, serverErrors)

    const handleSubmit = form.handleSubmit(async data => {
        await onSave(defaultValues?.id ? { ...data, id: defaultValues.id } : data)
        form.reset()
        onOpenChange(false)
    })
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
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="courseID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <SelectOptionCourse onValueChange={field.onChange} defaultValue={field.value} />
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
                                    <SelectOptionLecture onValueChange={field.onChange} defaultValue={field.value} />
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
                                    <SelectOptionRoom defaultValue={field.value} onValueChange={field.onChange} />
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
                                    <SelectOptionTimeslot onValueChange={field.onChange} defaultValue={field.value} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="classID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <SelectOptionClass onValueChange={field.onChange} defaultValue={field.value} />
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
                            <Button type="submit">Save {onLoading && (<LoaderCircle className='animate-spin' />)}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}