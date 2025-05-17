import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { bulkDelete } from "@/lib/api/timeslot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type BulkDeleteButtonProps = {
    selectedIds: any[]
}

export function BulkDeleteButton({ selectedIds }: BulkDeleteButtonProps) {
    const [isOpen, SetIsOpen] = useState(false)
    const qc = useQueryClient()

    const { isPending, mutateAsync } = useMutation({
        mutationFn: async (ids: any[]) => {
            await bulkDelete(ids)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["timeslots"] })
            toast.success(`Berhasil menghapus ${selectedIds.length} items`)
            SetIsOpen(false)
        },
        onError: (error) => {
            toast.error(`Gagal menghapus data terpilih: ${error.message}`)
        }
    })
    return (
        <>
            <Button
                className='has-disabled:cursor-not-allowed bg-red-500 text-white hover:bg-red-800 cursor-pointer'
                disabled={selectedIds.length == 0}
                onClick={() => SetIsOpen(!isOpen)}
            >
                <Trash2 />  Bulk Delete
            </Button>
            <DeleteConfirmDialog
                description={`Yakin ingin menghapus ${selectedIds.length} items yang dipilih, proses tidak dapat dibatalkan`}
                onConfirm={async () => { await mutateAsync(selectedIds) }}
                onOpenChange={() => SetIsOpen(!isOpen)}
                open={isOpen}
                title={`Hapus ${selectedIds.length} items?`}
                onLoading={isPending}
            />
        </>
    )
}