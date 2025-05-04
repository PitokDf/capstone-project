'use client'

import { Class } from "@/types/class";
import { ClassDialog, ClassFormValues } from "./ClassesDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "@/lib/api/class";
import { toast } from "sonner";
import { useState } from "react";

type EditClassProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Class
}

export function EditClass({
    data, onOpenChange, open
}: EditClassProps) {
    const qc = useQueryClient()
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])
    const { mutateAsync: mutateEditClass, isPending } = useMutation({
        mutationFn: updateClass,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["classes"] });
            onOpenChange(false)
            toast.success("Updated Class", {
                description: "Data kelas berhasil di perbarui.",
                duration: 3000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || []

            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error("Error!")
            }
        }
    })

    const handleSave = async (data: ClassFormValues) => {
        await mutateEditClass(data)
    }
    return (
        <ClassDialog
            serverErrors={serverErrors}
            onOpenChange={onOpenChange}
            open={open}
            title="Edit Class"
            defaultValues={data}
            onSave={handleSave}
            onLoading={isPending}
        />
    )
}