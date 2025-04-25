"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CourseDialog } from '@/components/features/admin/courses/course-dialog';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import axiosInstance from '@/lib/axios';

interface Course {
    id?: number;
    code: string;
    name: string;
    sks: number;
    duration: number;
}

const PAGE_SIZE = 10;

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

    const filteredCourses = courses.filter(course =>
        course?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleAddCourse = async (course: Omit<Course, 'id'>) => {
        const newCourse = {
            ...course,
            id: Math.max(0, ...courses.map(c => c.id!)) + 1
        };
        try {
            const res = await axiosInstance.post("/course", course)
            if (res.status === 200) {
                setCourses([...courses, newCourse]);
            }
            setIsAddDialogOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditCourse = (updatedCourse: Course) => {
        setCourses(courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
        ));
        setIsEditDialogOpen(false);
        setCurrentCourse(null);
    };

    const handleDeleteCourse = () => {
        if (currentCourse) {
            setCourses(courses.filter(course => course.id !== currentCourse.id));
            setIsDeleteDialogOpen(false);
            setCurrentCourse(null);
        }
    };

    const openEditDialog = (course: Course) => {
        setCurrentCourse(course);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (course: Course) => {
        setCurrentCourse(course);
        setIsDeleteDialogOpen(true);
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get('/course');
                console.log(res);

                setCourses(res.data.data)
                setIsLoading(false)
            } catch (error) {
                console.log(error);
            }
        })()
    }, [])

    const columns: { header: string, accessorKey: keyof Course, cell?: (course: Course) => React.ReactNode }[] = [
        { header: "Code", accessorKey: "code" },
        { header: "Name", accessorKey: "name" },
        { header: "SKS", accessorKey: "sks" },
        { header: "Duration (min)", accessorKey: "duration" },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (course: Course) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(course)}
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(course)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
            </div>

            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search courses..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                isLoading={isLoading}
                data={paginatedCourses}
                columns={columns}
                pageSize={PAGE_SIZE}
                totalItems={filteredCourses.length}
                emptyMessage="No courses found."
            />

            <CourseDialog
                onLoading={true}
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleAddCourse}
                title="Add Course"
            />

            {currentCourse && (
                <CourseDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleEditCourse}
                    title="Edit Course"
                    defaultValues={currentCourse}
                />
            )}

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteCourse}
                title="Delete Course"
                description={`Are you sure you want to delete ${currentCourse?.name}? This action cannot be undone.`}
            />
        </div>
    );
}