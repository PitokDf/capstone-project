import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getTimeslots } from "@/lib/api/timeslot";
import { formatTime } from "@/lib/utils";
import { Timeslot } from "@/types/timeslot";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

type TimeSlotTableProps = {
    onEdit: (data: Timeslot) => void;
    onDelete: (data: Timeslot) => void;
}
export function TimeSlotTable({ onEdit, onDelete }: TimeSlotTableProps) {
    const { data, isPending } = useQuery({
        queryFn: getTimeslots,
        queryKey: ["timeslots"]
    })

    return (
        <DataTable
            data={data!}
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(item)}
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(item)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
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