import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getRooms } from "@/lib/api/room";
import { Room } from "@/types/room";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

interface RoomTableProps {
    onEdit: (data: Room) => void;
    onDelete: (data: Room) => void;
}

export function RoomTable({
    onDelete, onEdit
}: RoomTableProps) {
    const { data: rooms, isPending } = useQuery({
        queryKey: ["rooms"],
        queryFn: getRooms
    })
    return (
        <DataTable
            data={rooms!}
            columns={[
                { header: "Kode", accessorKey: "code" },
                { header: "Nama", accessorKey: "name" },
                { header: "Kapasitas", accessorKey: "capacity" },
                { header: "Lokasi", accessorKey: "location" },
                {
                    header: "Actions", accessorKey: "id",
                    cell: (data: Room) => (
                        <div className="flex justify-end gap-2">
                            <Button variant={"ghost"} size={"icon"} onClick={() => onEdit(data)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant={"ghost"} size={"icon"} onClick={() => onDelete(data)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                }
            ]}
            isLoading={isPending}
            emptyMessage="No rooms found."
            filterBy={[
                { label: "Nama", value: "name" },
                { label: "Kapasitas", value: "capacity" },
                { label: "Lokasi", value: "location" }
            ]}
        />
    )
}