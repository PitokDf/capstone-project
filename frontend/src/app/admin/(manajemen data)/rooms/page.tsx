"use client"

import { useEffect, useState } from 'react';
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

export default function RoomsPage() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

    useEffect(() => { document.title = "Rooms - Admin" }, [])

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