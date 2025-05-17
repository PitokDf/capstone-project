import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TimeSlotDialog, TimeSlotFormValues } from "./TimeSlotDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTimeslot } from "@/lib/api/timeslot";
import { toast } from "sonner";

export function AddTimeSlot() {
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const qc = useQueryClient()

    const { mutateAsync: mutateAddTimeslots, isPending } = useMutation({
        mutationFn: addTimeslot,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["timeslots"] })
            setIsOpen(!isOpen)
            toast.success("New timeslots", {
                description: "Berhasil menambahkan slot waktu baru.",
                duration: 2500
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || []
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error("Server error, coba lagi nanti.")
            }
        }
    })

    const handleSave = async (data: TimeSlotFormValues) => {
        await mutateAddTimeslots(data)
    }
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Time Slot
            </Button>

            <TimeSlotDialog
                onOpenChange={setIsOpen}
                onSave={handleSave}
                open={isOpen}
                title="Add Timeslot"
                onLoading={isPending}
                serverErrors={serverErrors}
            />
        </>
    )
}