import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteRoom } from "@/lib/api/room";
import { Room } from "@/types/room";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteRoomProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room: Room;
}
export function DeleteRoom({ onOpenChange, open, room }: DeleteRoomProps) {
    const qc = useQueryClient()
    const { mutateAsync } = useMutation({
        mutationFn: deleteRoom,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['rooms'] })
            toast("Berhasil menghapus.", {
                description: `Berhasil menghapus data ruangan ${room.name}.`,
                duration: 3000
            })
            onOpenChange(false);
        },
        onError: () => {
            toast("Gagal menghapus.", {
                description: `Gagal menghapus data ruangan ${room.name}.`,
                duration: 3000
            })
        }
    })
    if (!open) return null
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={async () => { await mutateAsync(room) }}
            title="Delete Room"
            description={`Are you sure you want to delete ${room?.name}? This action cannot be undone.`}
        />
    )
}