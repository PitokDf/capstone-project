import { Button } from "@/components/ui/button";
import { RoomDialog, RoomFormValues } from "./RoomDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRoom, updateRoom } from "@/lib/api/room";
import { toast } from "sonner";
import { Room } from "@/types/room";

type EditRoomProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    room: Room
}
export function EditRoom({
    open, onOpenChange, room
}: EditRoomProps) {
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()
    const { isPending, mutateAsync: mutateUpdateRoom } = useMutation({
        mutationFn: async (data: any) => {
            await updateRoom(data)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['rooms'] })
            toast.success("Updated room.", {
                description: "Berhasil mengupdate data ruangan.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah ruangan:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    return (
        <RoomDialog
            title="Edit Room"
            open={open}
            onOpenChange={onOpenChange}
            defaultValues={room}
            onSave={async (data: RoomFormValues) => { await mutateUpdateRoom(data) }}
            onLoading={isPending}
            serverErrors={serverErrors}
        />
    )
}