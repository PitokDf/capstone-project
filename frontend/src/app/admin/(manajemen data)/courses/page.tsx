'use client'

import { AddCourse } from "@/components/features/admin/courses/AddCourse"
import { CoursesTable } from "@/components/features/admin/courses/CoursesTable"
import { DeleteCourse } from "@/components/features/admin/courses/DeleteCourse"
import { getCourses } from "@/lib/api/course"
import { Course } from "@/types/course"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function CoursesPage() {
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => { document.title = "Courses - Admin" }, [])

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses
    })

    const handleDelete = (course: Course) => {
        setCurrentCourse(course);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div>
            {isError && (<p>{error.message} </p>)}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                <AddCourse />
            </div>
            <CoursesTable
                data={data}
                isLoading={isLoading}
                pageSize={10}
                onDelete={handleDelete}
                onEdit={() => { }} />

            <DeleteCourse
                course={currentCourse!}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </div>
    )
}