import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import { DataTable } from "@/components/ui/data-table";
import { getTimeslots } from "@/lib/api/timeslot";
import { formatTime } from "@/lib/utils";
import { Timeslot } from "@/types/timeslot";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type TimeSlotTableProps = {
    onEdit: (data: Timeslot) => void;
    onDelete: (data: Timeslot) => void;
    setSelectedIds: React.Dispatch<React.SetStateAction<any[]>>
    selectedIds: any[];
}
export function TimeSlotTable({ onEdit, onDelete, selectedIds, setSelectedIds }: TimeSlotTableProps) {
    const { data, isPending } = useQuery({
        queryFn: getTimeslots,
        queryKey: ["timeslots"]
    })

    return (
        <DataTable
            showCheckBox
            data={data!}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            isLoading={isPending}
            columns={[
                { header: "Day", accessorKey: "day" },
                {
                    header: "Waktu Mulai", accessorKey: "starTime",
                    cell: (item) => {
                        return (<p>{formatTime(item.starTime)}</p>)
                    }
                },
                {
                    header: "Waktu Selesai", accessorKey: "endTime",
                    cell: (item) => {
                        return (<p>{formatTime(item.endTime)}</p>)
                    }
                },
                {
                    header: "Durasi (Jam)", accessorKey: "endTime",
                    cell: (item) => {
                        const durationMs = new Date(item.endTime).getTime() - new Date(item.starTime).getTime();
                        const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
                        const durationMinute = Math.floor(durationMs % (1000 * 60 * 60) / (1000 * 60))
                        return (<p>{durationHours}h {durationMinute}m</p>)
                    }
                },
                {
                    header: "Waktu Selesai", accessorKey: "endTime",
                    cell: (item) => {
                        return (
                            <div className="flex justify-end gap-2">
                                <EditButton onEdit={() => onEdit(item)} />
                                <DeleteButton onDelete={() => onDelete(item)} />
                            </div>)
                    }
                },
            ]}
            filterBy={[
                { label: "Day", value: "day" }
            ]}
        />
    )
}