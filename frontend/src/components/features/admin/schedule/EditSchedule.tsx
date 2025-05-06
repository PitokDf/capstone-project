import { Button } from "@/components/ui/button";
import { ScheduleDialog } from "./ScheduleDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule, editSchedule } from "@/lib/api/schedule";
import { toast } from "sonner";
import { Schedule } from "@/types/schedule";

// Define the ServerError type to match ScheduleDialogProps
type ServerError = {
    path: any;
    msg: string;
};

type EditScheduleProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Schedule
}

export function EditSchedule({
    data,
    onOpenChange,
    open
}: EditScheduleProps) {
    const [serverErrors, setServerErrors] = useState<ServerError[]>([]);
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: editSchedule,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['schedules'] })
            onOpenChange(false)
            toast.success("Updated Schedule.", {
                description: "Berhasil merubah jadwal baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal update jadwal:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    const handleSave = async (data: any) => {
        await mutateAsync(data)
    }

    return (
        <>
            <ScheduleDialog
                title="Edit Schedule"
                onLoading={isPending}
                onOpenChange={onOpenChange}
                onSave={handleSave}
                open={open}
                serverErrors={serverErrors}
                defaultValues={data}
            />
        </>
    )
}