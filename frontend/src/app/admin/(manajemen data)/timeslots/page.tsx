"use client"

import { useEffect, useState } from 'react';
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
import { TimeSlotTable } from '@/components/features/admin/timeslots/TimeSlotTable';
import { AddTimeSlot } from '@/components/features/admin/timeslots/AddTimeslot';
import { Timeslot } from '@/types/timeslot';
import { DeleteTimeslot } from '@/components/features/admin/timeslots/DeleteTimeslot';
import { EditTimeslot } from '@/components/features/admin/timeslots/EditTimeslot';


export default function TimeSlotsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTimeSlot, setCurrentTimeSlot] = useState<Timeslot | null>(null);

    useEffect(() => { document.title = "Timeslots - Admin" }, [])

    const openEditDialog = (timeSlot: Timeslot) => {
        setCurrentTimeSlot(timeSlot);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (timeSlot: Timeslot) => {
        setCurrentTimeSlot(timeSlot);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
                <AddTimeSlot />
            </div>

            <TimeSlotTable
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />

            {currentTimeSlot && (
                <EditTimeslot
                    timeslot={currentTimeSlot}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}

            <DeleteTimeslot
                onOpenChange={setIsDeleteDialogOpen}
                open={isDeleteDialogOpen}
                timeSlot={currentTimeSlot!}
            />
        </div>
    );
}