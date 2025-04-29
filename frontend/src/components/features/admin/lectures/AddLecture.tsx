"use client"

import { Button } from "@/components/ui/button";
import { addLecturer } from "@/lib/api/lecture";
import { Lecture } from "@/types/lecture";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LecturerDialog } from "./LectureDialog";

export const AddLecture = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()

    const { mutateAsync: mutateAddLecturer, isPending } = useMutation({
        mutationFn: addLecturer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['lectures'] })
            setIsOpen(!isOpen)
            toast.success("New lecturer.", {
                description: "Berhasil menambahkan dosen baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah lecture:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })
    const handleAddLecturer = async (course: Omit<Lecture, "id">) => {
        await mutateAddLecturer(course)
    }

    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Lecturer
            </Button>
            <LecturerDialog
                open={isOpen}
                onOpenChange={() => { setIsOpen(!isOpen) }}
                onSave={handleAddLecturer}
                title="Add Lecturer"
                serverErrors={serverErrors}
                onLoading={isPending}
            />
        </>
    );
};
