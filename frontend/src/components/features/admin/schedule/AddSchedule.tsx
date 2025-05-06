import { Button } from "@/components/ui/button";
import { ScheduleDialog } from "./ScheduleDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "@/lib/api/schedule";
import { toast } from "sonner";

// Define the ServerError type to match ScheduleDialogProps
type ServerError = {
    path: any;
    msg: string;
};

export function AddSchedule() {
    const [isOpen, setIsOpen] = useState(false)
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: addSchedule,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['schedules'] })
            setIsOpen(!isOpen)
            toast.success("New Schedule.", {
                description: "Berhasil menambahkan jadwal baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah jadwal:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            }
            toast.error('Duplikat schedule, coba lagi.');
        }
    })

    const handleSave = async (data: any) => {
        await mutateAsync(data)
    }
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
            <ScheduleDialog
                title="Add Schedule"
                onLoading={isPending}
                onOpenChange={() => { setIsOpen(!isOpen) }}
                onSave={handleSave}
                open={isOpen}
                serverErrors={serverErrors}
            />
        </>
    )
}