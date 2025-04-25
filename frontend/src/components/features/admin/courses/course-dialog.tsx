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
import { LoaderCircle } from 'lucide-react';

const courseSchema = z.object({
    code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code cannot exceed 10 characters"),
    name: z.string().min(3, "Name must be at least 3 characters").max(125, "Name cannot exceed 125 characters"),
    sks: z.coerce.number().int().min(1, "SKS must be at least 1").max(6, "SKS cannot exceed 6"),
    duration: z.coerce.number().int().min(30, "Duration must be at least 30 minutes").max(240, "Duration cannot exceed 240 minutes"),
});

export type CourseFormValues = z.infer<typeof courseSchema> & { id?: number };
interface ServerError { path: string; msg: string }

interface CourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: CourseFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: CourseFormValues & { id?: number };
}

export function CourseDialog({
    open,
    onOpenChange,
    onSave,
    title,
    serverErrors,
    onLoading,
    defaultValues = {
        code: '',
        name: '',
        sks: 3,
        duration: 120
    }
}: CourseDialogProps) {
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues,
    });

    useEffect(() => {
        if (open) form.reset(defaultValues);
    }, [open]);

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof CourseFormValues).invalid === false) {
                form.setError(e.path as keyof CourseFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])


    const handleSubmit = form.handleSubmit(async data => {
        await onSave(defaultValues.id ? { ...data, id: defaultValues.id } : data)
        form.reset();
        onOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the course below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., CS101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Introduction to Computer Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKS</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="3" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="120" {...field} />
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