import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import { DataTable } from "@/components/ui/data-table";
import { getSchedules } from "@/lib/api/schedule";
import { formatTime } from "@/lib/utils";
import { Schedule } from "@/types/schedule";
import { useQuery } from "@tanstack/react-query";

type ScheduleTableProps = {
    onEdit: (schedule: Schedule) => void
    onDelete: (schedule: Schedule) => void
}

export function ScheduleTable({
    onEdit,
    onDelete
}: ScheduleTableProps) {
    const { data, isPending } = useQuery({
        queryKey: ["schedules"],
        queryFn: getSchedules
    })
    return (
        <DataTable
            data={data!}
            isLoading={isPending}
            columns={[
                {
                    header: "Course", accessorKey: "course",
                    cell: (item) => (
                        <span>{item.course?.name}</span>
                    )
                },
                {
                    header: "Dosen", accessorKey: "lecture",
                    cell: (item) => (
                        <span>{item.lecture?.name}</span>
                    )
                },
                {
                    header: "Room", accessorKey: "room",
                    cell: (item) => (
                        <span>{item.room?.name}</span>
                    )
                },
                {
                    header: "Class", accessorKey: "class",
                    cell: (item) => (
                        <span>{item.class?.name}</span>
                    )
                },
                {
                    header: "day", accessorKey: "timeSlotID",
                    cell: (item) => (
                        <span>{item.timeSlot?.day}</span>
                    )
                },
                {
                    header: "Time", accessorKey: "timeSlotID",
                    cell: (item) => (
                        <span>{formatTime(item.timeSlot?.starTime!)} - {formatTime(item.timeSlot?.endTime!)}</span>
                    )
                },
                {
                    header: "Actions", accessorKey: "id",
                    cell: (item) => (
                        <div className="flex justify-end gap-2">
                            <EditButton onEdit={() => onEdit(item)} />
                            <DeleteButton onDelete={() => onDelete(item)} />
                        </div>
                    )
                },
            ]}
        />
    )
}