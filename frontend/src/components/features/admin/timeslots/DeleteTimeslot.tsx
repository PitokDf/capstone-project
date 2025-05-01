import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteTimeslot } from "@/lib/api/timeslot";
import { formatTime } from "@/lib/utils";
import { Timeslot } from "@/types/timeslot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteTimeslotProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timeSlot: Timeslot
}
export function DeleteTimeslot({
    open, onOpenChange, timeSlot
}: DeleteTimeslotProps) {
    const qc = useQueryClient()
    const { mutateAsync: mutateDeleteTimeslot, isPending } = useMutation({
        mutationFn: deleteTimeslot,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['timeslots'] })
            toast("Berhasil menghapus.", {
                description: `Berhasil menghapus data slot waktu ${timeSlot.day}.`,
                duration: 3000
            })
            onOpenChange(false);
        },
        onError: () => {
            toast("Gagal menghapus.", {
                description: `Gagal menghapus data slot waktu ${timeSlot.day}.`,
                duration: 3000
            })
        }
    })

    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={async () => {
                await mutateDeleteTimeslot(timeSlot.id)
            }}
            onLoading={isPending}
            title="Delete Time Slot"
            description={`Are you sure you want to delete this time slot (${timeSlot?.day}, ${timeSlot ? formatTime(new Date(timeSlot.starTime)) : ''} - ${timeSlot?.day}, ${timeSlot ? formatTime(new Date(timeSlot.endTime)) : ''})? This action cannot be undone.`}
        />
    )
}