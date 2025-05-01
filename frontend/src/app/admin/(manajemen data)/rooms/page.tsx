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
import { RoomDialog, RoomFormValues } from '@/components/features/admin/rooms/RoomDialog';
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { AddRoom } from '@/components/features/admin/rooms/AddRoom';
import { RoomTable } from '@/components/features/admin/rooms/RoomTable';
import { DeleteRoom } from '@/components/features/admin/rooms/DeleteRoom';
import { EditRoom } from '@/components/features/admin/rooms/EditRoom';

interface Room {
    id: number;
    code: string;
    name: string;
    capacity: string;
    location: string;
}

// Mock data
const initialRooms: Room[] = [
    { id: 1, code: "R101", name: "Lecture Hall 1", capacity: "120", location: "Building A, Floor 1" },
    { id: 2, code: "R102", name: "Lecture Hall 2", capacity: "80", location: "Building A, Floor 1" },
    { id: 3, code: "R201", name: "Classroom 201", capacity: "40", location: "Building B, Floor 2" },
    { id: 4, code: "R202", name: "Classroom 202", capacity: "40", location: "Building B, Floor 2" },
    { id: 5, code: "R301", name: "Computer Lab 1", capacity: "30", location: "Building C, Floor 3" },
    { id: 6, code: "R302", name: "Computer Lab 2", capacity: "30", location: "Building C, Floor 3" },
    { id: 7, code: "R401", name: "Science Lab", capacity: "25", location: "Building D, Floor 4" },
    { id: 8, code: "R501", name: "Seminar Room", capacity: "60", location: "Building E, Floor 5" },
];

export default function RoomsPage() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

    const handleDelete = (room: Room) => {
        setCurrentRoom(room)
        setIsDeleteDialogOpen(true)
    }

    const handleEdit = (room: Room) => {
        setCurrentRoom(room)
        setIsUpdateDialogOpen(true)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
                <AddRoom />
            </div>

            <RoomTable onDelete={handleDelete} onEdit={handleEdit} />

            {currentRoom && (
                <DeleteRoom
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                    room={currentRoom}
                />
            )}

            {currentRoom && (
                <EditRoom
                    onOpenChange={setIsUpdateDialogOpen}
                    open={isUpdateDialogOpen}
                    room={currentRoom}
                />
            )}
        </div>
    );
}