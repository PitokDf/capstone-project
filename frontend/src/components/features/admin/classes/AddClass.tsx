'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ClassDialog } from "./ClassesDialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Class } from "@/types/class";
import { toast } from "sonner";
import { addClass } from "@/lib/api/class";

export function AddClass() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()


    const { mutateAsync: mutateAddClass, isPending } = useMutation({
        mutationFn: addClass,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] })
            setIsOpen(!isOpen)
            toast.success("New Class.", {
                description: "Berhasil menambahkan Kelas baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah class:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })
    const handleAddCourse = async (course: Omit<Class, "id">) => {
        await mutateAddClass(course)
    }

    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Class
            </Button>

            <ClassDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                onSave={handleAddCourse}
                title="Add Class"
                onLoading={isPending}
                serverErrors={serverErrors}
            />
        </>
    )
}