"use client"

import { useEffect, useState } from 'react';
import { LectureTable } from '@/components/features/admin/lectures/LectureTable';
import { AddLecture } from '@/components/features/admin/lectures/AddLecture';
import { EditLecturee } from '@/components/features/admin/lectures/EditLecture';
import { DeleteLecturer } from '@/components/features/admin/lectures/DeleteLecture';
import { AddPrefrenceDialog } from '@/components/features/admin/lectures/AddPreferenceDialog';
import { Lecture } from '@/types/lecture';

interface Lecturer {
    id: number;
    nip: string;
    name: string;
    preference: string;
}

export default function LecturersPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddPrefrenceDialogOpen, setIsAddPrefrenceDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentLecturer, setCurrentLecturer] = useState<Lecture | null>(null);

    useEffect(() => { document.title = "Lectures - Admin" }, [])

    const openEditDialog = (lecturer: Lecture) => {
        setCurrentLecturer(lecturer);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (lecturer: Lecture) => {
        setCurrentLecturer(lecturer);
        setIsDeleteDialogOpen(true);
    };


    const openAddPrefrenceeDialog = (lecturer: Lecture) => {
        setCurrentLecturer(lecturer);
        setIsAddPrefrenceDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Lecturers</h1>
                <AddLecture />
            </div>

            <LectureTable
                onDelete={openDeleteDialog}
                onEdit={openEditDialog}
                onAddPrefrence={openAddPrefrenceeDialog} />

            {currentLecturer && isEditDialogOpen && (
                <EditLecturee
                    lecturer={currentLecturer}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}

            {currentLecturer && isDeleteDialogOpen && (
                <DeleteLecturer
                    lecturer={currentLecturer}
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                />
            )}

            {isAddPrefrenceDialogOpen && currentLecturer && (
                <AddPrefrenceDialog onOpenChange={setIsAddPrefrenceDialogOpen} open={isAddPrefrenceDialogOpen} lecturer={currentLecturer!} />
            )}
        </div>
    );
}