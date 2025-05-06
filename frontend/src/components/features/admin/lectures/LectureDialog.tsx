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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplyServerErrors } from '@/hooks/UseApplyServerErrors';

// Schema for lecturer form validation
const lecturerSchema = z.object({
    nip: z.string().min(6, "NIP must be at least 6 characters").regex(/^\d+$/, "NIP harus berupa angka saja"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    preference: z.string(),
});

export type LecturerFormValues = z.infer<typeof lecturerSchema> & { id?: number };

interface ServerError { path: keyof LecturerFormValues; msg: string }
interface LecturerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: LecturerFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: LecturerFormValues & { id?: number };
}

export function LecturerDialog({
    open,
    onOpenChange,
    onSave,
    title,
    serverErrors,
    onLoading,
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

    useEffect(() => {
        if (open && title === "Edit Lecturer") form.reset(defaultValues);
    }, [open]);

    useApplyServerErrors<LecturerFormValues>(form, serverErrors!)

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
                        Fill in the details for the lecturer below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="nip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIP</FormLabel>
                                    <FormControl>
                                        <Input readOnly={title === "Edit Lecturer"} placeholder="e.g., 198001" {...field} />
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
                                        <Select value={field.value} onValueChange={field.onChange}
                                        >
                                            <SelectTrigger id="preference" className="col-span-3">
                                                <SelectValue placeholder="Select a preference" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Morning">Morning</SelectItem>
                                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                                <SelectItem value="Monday">Monday</SelectItem>
                                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                                <SelectItem value="Wednesday">Wednesday</SelectItem>
                                                <SelectItem value="Thursday">Thursday</SelectItem>
                                                <SelectItem value="Friday">Friday</SelectItem>
                                            </SelectContent>
                                        </Select>
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