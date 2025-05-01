import { Timeslot } from "@/types/timeslot";
import { TimeSlotDialog } from "./TimeSlotDialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTimslot } from "@/lib/api/timeslot";
import { toast } from "sonner";

type EditTimeslotProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    timeslot: Timeslot
}

export function EditTimeslot({
    onOpenChange, open, timeslot
}: EditTimeslotProps) {
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()
    const { isPending, mutateAsync } = useMutation({
        mutationFn: updateTimslot,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['timeslots'] })
            toast.success("Updated timeslot.", {
                description: "Berhasil mengupdate data timeslot.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal update timeslot:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })
    return (
        <TimeSlotDialog
            open={open}
            onLoading={isPending}
            onOpenChange={onOpenChange}
            title="Edit Timeslot"
            defaultValues={timeslot}
            serverErrors={serverErrors}
            onSave={async (timeslot: any) => {
                await mutateAsync(timeslot)
                onOpenChange(false)
            }}
        />
    )
}