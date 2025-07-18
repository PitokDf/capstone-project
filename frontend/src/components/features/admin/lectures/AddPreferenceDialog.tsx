'use client'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addOrDeleteLecturePrefrenceTime } from "@/lib/api/lecture";
import { getTimeslots } from "@/lib/api/timeslot";
import { formatTime } from "@/lib/utils";
import { Lecture } from "@/types/lecture";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AddPreferenceDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lecturer: Lecture
}

export function AddPrefrenceDialog({
    lecturer,
    onOpenChange,
    open = false
}: AddPreferenceDialogProps) {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<number[]>(lecturer.prefrredSlots.map(timePrefrence => timePrefrence.timeslotID) || [])
    // Update atau Delete Dosen prefrence
    const qc = useQueryClient()

    const handleSelectedTimeslot = (slotId: number) => {
        if (selectedTimeSlot.includes(slotId)) {
            setSelectedTimeSlot(selectedTimeSlot.filter(id => id !== slotId))
        } else {
            setSelectedTimeSlot([...selectedTimeSlot, slotId])
        }
    }

    // ambiak data dari API
    const { data: timeslots, isPending: isTimeSlotFetching } = useQuery({
        queryFn: getTimeslots,
        queryKey: ["timeslots"]
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({ id, preferenceIds }: { id: number, preferenceIds: number[] }) =>
            await addOrDeleteLecturePrefrenceTime(id, preferenceIds),
        onSettled: () => qc.invalidateQueries({ queryKey: ["lectures"] }),
        onSuccess: () => {
            onOpenChange(false)
            toast.success("Lecture prefrence.", {
                description: "Berhasil memperbarui prefrensi dosen",
                duration: 3000
            })
        },
        onError: (error: any, _variables, context) => {
            toast.error("Lecture prefrence", {
                description: error.message,
                duration: 3000
            })
        }
    })

    if (isTimeSlotFetching || isPending) return null

    const groupedTimeslots = timeslots?.reduce((acc, slot) => {
        if (!acc[slot.day]) acc[slot.day] = [];
        acc[slot.day].push(slot);
        return acc;
    }, {} as Record<string, typeof timeslots>);



    const handleAddOrDeleteLecturePrefrence = async (lectureID: number, prefrenceIds: number[]) => {
        console.log(prefrenceIds);

        await mutateAsync({ id: lectureID, preferenceIds: prefrenceIds })
    }

    return (
        <Dialog open={open && !isTimeSlotFetching} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Lecturer Time Preferences</DialogTitle>
                    <DialogDescription>
                        Select preferred time slots for {lecturer.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4 max-h-[400px] overflow-auto">
                    {Object.entries(groupedTimeslots!).map(([day, slots]) => (
                        <div key={day} className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="font-medium">{day}</h3>
                                <Checkbox
                                    title="pilih semua"
                                    checked={slots.every(slot => selectedTimeSlot.includes(slot.id))}
                                    onCheckedChange={() => {
                                        setSelectedTimeSlot(prev => {
                                            const daySlotIds = slots.map(slot => slot.id);
                                            const allSelected = daySlotIds.every(id => prev.includes(id));
                                            if (allSelected) {
                                                return prev.filter(id => !daySlotIds.includes(id));
                                            } else {
                                                return [...prev, ...daySlotIds.filter(id => !prev.includes(id))];
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                {
                                    timeslots?.filter(slot => slot.day === day).length === 0 ? (
                                        <div className="px-3 py-2 rounded-md cursor-pointer flex justify-between items-center text-sm bg-gray-200 dark:bg-gray-800">
                                            <span>Tidak ada slot waktu tersedia.</span>
                                        </div>
                                    ) :
                                        timeslots?.filter(slot => slot.day === day).map((slot, index) => (
                                            <div key={day + index} className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center text-sm ${selectedTimeSlot.includes(slot.id)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary hover:bg-secondary/80"
                                                }`}
                                                onClick={() => handleSelectedTimeslot(slot.id)}>
                                                <span>{formatTime(slot.starTime)} - {formatTime(slot.endTime)}</span>
                                                {selectedTimeSlot.includes(slot.id) &&
                                                    <Check className="w-4 h-4 text-white" />
                                                }
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={() => handleAddOrDeleteLecturePrefrence(lecturer.id, selectedTimeSlot)}>
                        Save Preferences {isPending && (<Loader2 className="animate-spin w-4 h-4" />)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}