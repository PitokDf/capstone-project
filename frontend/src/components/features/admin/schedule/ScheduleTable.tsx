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
                    header: "Course", accessorKey: "courseName",
                    cell: (item) => (
                        <span>{item.courseName}</span>
                    )
                },
                {
                    header: "Dosen", accessorKey: "lecturerName",
                    cell: (item) => (
                        <span>{item.lecturerName}</span>
                    )
                },
                {
                    header: "Room", accessorKey: "roomName",
                    cell: (item) => (
                        <span>{item.roomName}</span>
                    )
                },
                {
                    header: "Class", accessorKey: "className",
                    cell: (item) => (
                        <span>{item.className}</span>
                    )
                },
                {
                    header: "day", accessorKey: "day",
                    cell: (item) => (
                        <span>{item.day}</span>
                    )
                },
                {
                    header: "Time", accessorKey: "endTime",
                    cell: (item) => (
                        <span>{formatTime(item.startTime!)} - {formatTime(item.endTime!)}</span>
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