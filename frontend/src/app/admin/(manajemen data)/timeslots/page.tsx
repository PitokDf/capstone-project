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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"secondary"}
                                className='cursor-pointer'>
                                <MoreHorizontal />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-80'>
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-medium leading-none"></h4>
                                    <p className="text-sm text-muted-foreground">
                                        Atur opsi untuk proses generate jadwal.
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="saveToDatabase" className="text-sm">
                                            Simpan ke database
                                        </Label>
                                        <Switch
                                            id="saveToDatabase"
                                        // defaultChecked={options.saveToDatabase}
                                        // onCheckedChange={() => handleToogle('saveToDatabase')}
                                        // checked={options.saveToDatabase}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="clearExisting" className="text-sm">
                                            Hapus Data Lama
                                        </Label>
                                        <Switch
                                            id="clearExisting"
                                        // defaultChecked={options.clearExisting}
                                        // onCheckedChange={() => handleToogle('clearExisting')}
                                        // checked={options.clearExisting}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="allowPartialResults" className="text-sm">
                                            Izinkan Hasil Sebagian
                                        </Label>
                                        <Switch
                                            id="allowPartialResults"
                                        // defaultChecked={options.allowPartialResults}
                                        // onCheckedChange={() => handleToogle('allowPartialResults')}
                                        // checked={options.allowPartialResults} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
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