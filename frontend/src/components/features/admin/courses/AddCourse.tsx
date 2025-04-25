"use client"

import { CourseDialog } from "@/components/features/admin/courses/course-dialog";
import { Button } from "@/components/ui/button";
import { addCourse } from "@/lib/api/course";
import { Course } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const AddCourse = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()

    const { mutateAsync: mutateAddCourse, isPending } = useMutation({
        mutationFn: addCourse,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] })
            setIsOpen(!isOpen)
            toast.success("New course.", {
                description: "Berhasil menambahkan mata kuliah baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah course:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })
    const handleAddCourse = async (course: Omit<Course, "id">) => {
        await mutateAddCourse(course)
    }

    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
            <CourseDialog
                open={isOpen}
                onOpenChange={() => { setIsOpen(!isOpen) }}
                onSave={handleAddCourse}
                title="Add Course"
                serverErrors={serverErrors}
                onLoading={isPending}
            />
        </>
    );
};
