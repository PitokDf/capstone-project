'use client';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteCourse } from "@/lib/api/course";
import { Course } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteCourse({ course, open, onOpenChange }: { course: Course, open: boolean, onOpenChange: (open: boolean) => void }) {
    const qc = useQueryClient();
    const { mutateAsync: mutateDeleteCourse } = useMutation({
        mutationFn: async () => deleteCourse(course.id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] })
            toast("Berhasil menghapus.", {
                description: `Berhasil menghapus mata kuliah ${course.name}.`,
                duration: 3000
            })
            onOpenChange(false);
        },
        onError: () => {
            toast("Gagal menghapus.", {
                description: `Gagal menghapus mata kuliah ${course.name}.`,
                duration: 3000
            })
        }
    })
    const handleDelete = async () => {
        await mutateDeleteCourse()
    }
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleDelete}
            title="Delete Course"
            description={`Are you sure you want to delete ${course?.name}? This action cannot be undone.`}
        />
    )
}