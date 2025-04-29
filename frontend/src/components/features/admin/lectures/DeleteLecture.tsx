import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteLecturer } from "@/lib/api/lecture";
import { Lecture } from "@/types/lecture";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteLecturer({
    lecturer, onOpenChange, open
}: {
    lecturer: Lecture, open: boolean, onOpenChange: (open: boolean) => void
}) {

    const qc = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async () => deleteLecturer(lecturer.id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['lectures'] })
            toast("Berhasil menghapus dosen.", {
                description: `Berhasil menghapus Dosen ${lecturer.name}.`,
                duration: 3000
            })
            onOpenChange(false);
        },
        onError: () => {
            toast("Gagal menghapus.", {
                description: `Gagal menghapus Dosen ${lecturer.name}.`,
                duration: 3000
            })
        }
    })

    return (
        <DeleteConfirmDialog
            open={open}
            title="Delete Lecturer"
            onLoading={isPending}
            onConfirm={async () => { await mutateAsync() }}
            onOpenChange={onOpenChange}
            description={`Are you sure want to delete ${lecturer.name}? This action cannot be undone.`}
        />
    )
}