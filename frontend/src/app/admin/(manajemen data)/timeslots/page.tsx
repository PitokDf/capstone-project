"use client"

import { useEffect, useState } from 'react';
import { TimeSlotTable } from '@/components/features/admin/timeslots/TimeSlotTable';
import { AddTimeSlot } from '@/components/features/admin/timeslots/AddTimeslot';
import { Timeslot } from '@/types/timeslot';
import { DeleteTimeslot } from '@/components/features/admin/timeslots/DeleteTimeslot';
import { EditTimeslot } from '@/components/features/admin/timeslots/EditTimeslot';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Settings2, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BulkDeleteButton } from '@/components/features/admin/timeslots/BulkDeleteButton';
import { MoreAction } from '@/components/features/admin/timeslots/MoreAction';


export default function TimeSlotsPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTimeSlot, setCurrentTimeSlot] = useState<Timeslot | null>(null);
    const [selectedIds, setSelectedIds] = useState<any[]>([])

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
                <div className='flex gap-2'>
                    <MoreAction />
                    <BulkDeleteButton selectedIds={selectedIds} />
                    <AddTimeSlot />
                </div>
            </div>

            <TimeSlotTable
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
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