import { Course } from "@/types/course";
import { CourseDialog, CourseFormValues } from "./course-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/lib/api/course";
import { toast } from "sonner";
import { useState } from "react";

type EditCourseProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course
}

export function EditCourse({
    open,
    course,
    onOpenChange
}: EditCourseProps) {
    const qc = useQueryClient();
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);

    const { mutateAsync: mutateUpdateCourse } = useMutation({
        mutationFn: async (data: any) => {
            await updateCourse(data);
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
        },
        onSuccess: () => {
            toast.success("Berhasil mengupdate course", {
                description: "Berhasil mengupdate course",
                duration: 3000
            })
        },
        onError: (error: any, _variables, context) => {

            console.log(error);

            toast.error("Gagal mengupdate course", {
                description: error.message,
                duration: 3000
            })
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah course:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    const handleEditCourse = async (data: CourseFormValues) => {
        await mutateUpdateCourse(data);
    }
    return (
        <CourseDialog
            open={open}
            onOpenChange={onOpenChange}
            onSave={handleEditCourse}
            title="Edit Course"
            defaultValues={course}
            serverErrors={serverErrors}
        />
    )
}