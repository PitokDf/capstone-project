'use client';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteSchedule } from "@/lib/api/schedule";
import { Schedule } from "@/types/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteSchedule({ data, open, onOpenChange }:
    { data: Schedule, open: boolean, onOpenChange: (open: boolean) => void }) {
    const qc = useQueryClient();
    const { mutateAsync: mutateDeleteSchedule, isPending } = useMutation({
        mutationFn: async () => deleteSchedule(data.id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['schedules'] })
            toast("Berhasil menghapus.", {
                description: `Berhasil menghapus jadwal kuliah.`,
                duration: 3000
            })
            onOpenChange(false);
        },
        onError: () => {
            toast("Gagal menghapus.", {
                description: `Gagal menghapus jadwal kuliah.`,
                duration: 3000
            })
        }
    })
    const handleDelete = async () => {
        await mutateDeleteSchedule()
    }
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleDelete}
            title="Delete Schedule"
            onLoading={isPending}
            description={`Are you sure you want to delete? This action cannot be undone.`}
        />
    )
}