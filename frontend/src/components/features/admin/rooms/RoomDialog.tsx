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

// Schema for room form validation
const roomSchema = z.object({
    code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code cannot exceed 10 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    capacity: z.string().min(1, "Capacity is required"),
    location: z.string().min(3, "Location must be at least 3 characters"),
});

export type RoomFormValues = z.infer<typeof roomSchema> & { id?: number };
interface ServerError { path: string; msg: string }
interface RoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: RoomFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: RoomFormValues & { id?: number };
}

export function RoomDialog({
    open,
    onOpenChange,
    onSave,
    title,
    onLoading,
    serverErrors,
    defaultValues = {
        code: '',
        name: '',
        capacity: '',
        location: '',
    }
}: RoomDialogProps) {
    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues,
    });

    useEffect(() => {
        if (open && title === "Edit Room") form.reset(defaultValues);
    }, [open]);

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof RoomFormValues).invalid === false) {
                form.setError(e.path as keyof RoomFormValues, {
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
                        Fill in the details for the room below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., R101" {...field} />
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
                                    <FormLabel>Room Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Lecture Hall 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 120" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Building A, Floor 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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