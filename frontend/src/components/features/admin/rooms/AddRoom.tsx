import { Button } from "@/components/ui/button";
import { RoomDialog, RoomFormValues } from "./RoomDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRoom } from "@/lib/api/room";
import { toast } from "sonner";

export function AddRoom() {
    const [isOpen, setIsOpen] = useState(false)
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()
    const { isPending, mutateAsync: mutateAddRoom } = useMutation({
        mutationFn: addRoom,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['rooms'] })
            setIsOpen(!isOpen)
            toast.success("New room.", {
                description: "Berhasil menambahkan ruangan baru.",
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

    const handleSave = async (data: RoomFormValues) => {
        await mutateAddRoom(data)
    }
    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>
            <RoomDialog
                title="Add Room"
                open={isOpen}
                onOpenChange={setIsOpen}
                onSave={handleSave}
                onLoading={isPending}
                serverErrors={serverErrors}
            />
        </>
    )
}