"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { LecturerDialog } from '@/components/features/admin/lectures/LectureDialog';
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog';
import { LectureTable } from '@/components/features/admin/lectures/LectureTable';
import { AddLecture } from '@/components/features/admin/lectures/AddLecture';
import { EditLecturee } from '@/components/features/admin/lectures/EditLecture';
import { DeleteLecturer } from '@/components/features/admin/lectures/DeleteLecture';

interface Lecturer {
    id: number;
    nip: string;
    name: string;
    preference: string;
}

// Mock data
const initialLecturers: Lecturer[] = [
    { id: 1, nip: "197001", name: "Dr. Alan Turing", preference: "Morning classes only" },
    { id: 2, nip: "198002", name: "Dr. Ada Lovelace", preference: "No classes on Friday" },
    { id: 3, nip: "199003", name: "Prof. John von Neumann", preference: "Afternoon classes preferred" },
    { id: 4, nip: "200004", name: "Dr. Grace Hopper", preference: "Maximum 3 classes per week" },
    { id: 5, nip: "201005", name: "Prof. Tim Berners-Lee", preference: "No back-to-back classes" },
    { id: 6, nip: "202006", name: "Dr. Margaret Hamilton", preference: "Tuesday and Thursday only" },
    { id: 7, nip: "203007", name: "Prof. Edsger Dijkstra", preference: "Morning classes preferred" },
    { id: 8, nip: "204008", name: "Dr. Barbara Liskov", preference: "Monday and Wednesday only" },
];

export default function LecturersPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentLecturer, setCurrentLecturer] = useState<Lecturer | null>(null);

    useEffect(() => { document.title = "Lectures - Admin" }, [])

    const openEditDialog = (lecturer: Lecturer) => {
        setCurrentLecturer(lecturer);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (lecturer: Lecturer) => {
        setCurrentLecturer(lecturer);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Lecturers</h1>
                <AddLecture />
            </div>

            <LectureTable
                data={initialLecturers}
                isLoading={false}
                onDelete={openDeleteDialog}
                onEdit={openEditDialog} />

            {currentLecturer && (
                <EditLecturee
                    lecturer={currentLecturer}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}

            {currentLecturer && (
                <DeleteLecturer
                    lecturer={currentLecturer}
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                />
            )}

        </div>
    );
}