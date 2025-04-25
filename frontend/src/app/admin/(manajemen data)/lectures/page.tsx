"use client"

import { useState } from 'react';
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
    const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentLecturer, setCurrentLecturer] = useState<Lecturer | null>(null);

    const filteredLecturers = lecturers.filter(lecturer =>
        lecturer.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddLecturer = (lecturer: Omit<Lecturer, 'id'>) => {
        const newLecturer = {
            ...lecturer,
            id: Math.max(0, ...lecturers.map(l => l.id)) + 1
        };
        setLecturers([...lecturers, newLecturer]);
        setIsAddDialogOpen(false);
    };

    const handleEditLecturer = (data: { nip: string; name: string; preference: string; }) => {
        if (currentLecturer) {
            const updatedLecturer = { ...currentLecturer, ...data };
            setLecturers(lecturers.map(lecturer =>
                lecturer.id === updatedLecturer.id ? updatedLecturer : lecturer
            ));
            setIsEditDialogOpen(false);
            setCurrentLecturer(null);
        }
    };

    const handleDeleteLecturer = () => {
        if (currentLecturer) {
            setLecturers(lecturers.filter(lecturer => lecturer.id !== currentLecturer.id));
            setIsDeleteDialogOpen(false);
            setCurrentLecturer(null);
        }
    };

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
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Lecturer
                </Button>
            </div>

            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search lecturers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bordeexport default function LecturePage() {
    return (
        <h1>Lecture</h1>
    )
}r rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>NIP</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Preference</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLecturers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                    No lecturers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLecturers.map((lecturer) => (
                                <TableRow key={lecturer.id}>
                                    <TableCell className="font-medium">{lecturer.nip}</TableCell>
                                    <TableCell>{lecturer.name}</TableCell>
                                    <TableCell>{lecturer.preference}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(lecturer)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openDeleteDialog(lecturer)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <LecturerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleAddLecturer}
                title="Add Lecturer"
            />

            {currentLecturer && (
                <LecturerDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSave={handleEditLecturer}
                    title="Edit Lecturer"
                    defaultValues={currentLecturer}
                />
            )}

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteLecturer}
                title="Delete Lecturer"
                description={`Are you sure you want to delete ${currentLecturer?.name}? This action cannot be undone.`}
            />
        </div>
    );
}