import { updateLecture } from "@/lib/api/lecture";
import { Lecture } from "@/types/lecture";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { LecturerDialog } from "./LectureDialog";

type EditLectuerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lecturer: Lecture
}

export function EditLecturee({
    lecturer,
    onOpenChange,
    open
}: EditLectuerProps) {
    const qc = useQueryClient()
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])

    const { mutateAsync: mutateUpdateLecturer, isPending } = useMutation({
        mutationFn: async (data: any) => {
            await updateLecture(data)
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["lectures"] }),
        onSuccess: () => {
            toast.success("Berhasil mengupdate lecturer", {
                description: "Berhasil mengupdate lecturer",
                duration: 3000
            })
        },
        onError: (error: any, _variables, context) => {

            console.log(error);

            toast.error("Gagal mengupdate lecturer", {
                description: error.message,
                duration: 3000
            })
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah lecturer:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    const handleEditLecturer = async (data: any) => {
        await mutateUpdateLecturer(data)
    }

    return (
        <LecturerDialog
            onOpenChange={onOpenChange}
            onSave={handleEditLecturer}
            open={open}
            title="Edit Lecturer"
            defaultValues={lecturer}
            onLoading={isPending}
            serverErrors={serverErrors}
        />
    )
}