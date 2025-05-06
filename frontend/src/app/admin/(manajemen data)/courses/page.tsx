'use client'

import { AddCourse } from "@/components/features/admin/courses/AddCourse"
import { CourseDialog } from "@/components/features/admin/courses/course-dialog"
import { CoursesTable } from "@/components/features/admin/courses/CoursesTable"
import { DeleteCourse } from "@/components/features/admin/courses/DeleteCourse"
import { EditCourse } from "@/components/features/admin/courses/EditCourse"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCourses } from "@/lib/api/course"
import { Course } from "@/types/course"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function CoursesPage() {
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => { document.title = "Courses - Admin" }, [])

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses
    })

    const handleDelete = (course: Course) => {
        setCurrentCourse(course);
        setIsDeleteDialogOpen(true);
    };

    const handleEdit = (course: Course) => {
        setCurrentCourse(course);
        setIsEditDialogOpen(true);
    }

    return (
        <div>
            {isError && (
                <Alert className="bg-red-700 dark:bg-red-700/50 mb-2">
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription className="text-white">{error?.message}</AlertDescription>
                </Alert>
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                <AddCourse />
            </div>

            <CoursesTable
                data={data!}
                isLoading={isLoading}
                pageSize={10}
                onDelete={handleDelete}
                onEdit={handleEdit} />

            {currentCourse && (
                <EditCourse
                    course={currentCourse}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}

            <DeleteCourse
                course={currentCourse!}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </div>
    )
}
