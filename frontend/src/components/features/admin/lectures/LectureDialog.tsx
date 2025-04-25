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
import { Textarea } from "@/components/ui/textarea";

// Schema for lecturer form validation
const lecturerSchema = z.object({
    nip: z.string().min(6, "NIP must be at least 6 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    preference: z.string(),
});

type LecturerFormValues = z.infer<typeof lecturerSchema> & { id?: number };

interface LecturerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: LecturerFormValues) => void;
    title: string;
    defaultValues?: LecturerFormValues & { id?: number };
}

export function LecturerDialog({
    open,
    onOpenChange,
    onSave,
    title,
    defaultValues = {
        nip: '',
        name: '',
        preference: '',
    }
}: LecturerDialogProps) {
    const form = useForm<LecturerFormValues>({
        resolver: zodResolver(lecturerSchema),
        defaultValues,
    });

    const handleSubmit = (data: LecturerFormValues) => {
        // If we're editing, preserve the ID
        if (defaultValues.id) {
            onSave({ ...data, id: defaultValues.id });
        } else {
            onSave(data);
        }
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the lecturer below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="nip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 198001" {...field} />
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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Dr. John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="preference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teaching Preference</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., Morning classes only, No classes on Friday"
                                            {...field}
                                        />
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
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}