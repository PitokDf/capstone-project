import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteClass } from "@/lib/api/class";
import { Class } from "@/types/class";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteClassPops = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Class
}

export function DeleteClass({
    data, onOpenChange, open
}: DeleteClassPops) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteClass,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["classes"] })
            toast.success("Deleted Class", {
                description: "Berhasil menghapus kelas."
            })
            onOpenChange(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            description={`Are you sure you want to delete this class ${data.name}? This action cannot be undone!`}
            title="Delete Class"
            onLoading={isPending}
            onConfirm={() => { mutateAsync(data) }}
        />
    )
}