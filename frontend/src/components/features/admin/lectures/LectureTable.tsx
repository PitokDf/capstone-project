import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getLectures } from "@/lib/api/lecture";
import { formatTime } from "@/lib/utils";
import { Lecture } from "@/types/lecture";
import { useQuery } from "@tanstack/react-query";
import { Clock, Pencil, Trash2 } from "lucide-react";

interface LectureTableProps {
    onEdit: (lecture: Lecture) => void;
    onDelete: (lecture: Lecture) => void;
    onAddPrefrence: (lecture: Lecture) => void;
}

export function LectureTable({
    onDelete, onEdit, onAddPrefrence
}: LectureTableProps) {
    const { data: lectures, isPending } = useQuery({
        queryKey: ["lectures"],
        queryFn: getLectures
    })
    return (
        <DataTable
            data={lectures!}
            columns={[
                { header: "NIP", accessorKey: "nip" },
                { header: "Nama", accessorKey: "name" },
                { header: "Preferensi", accessorKey: "preference" },
                {
                    header: "Time Slots", accessorKey: "prefrredSlots", cell: (lecturer: Lecture) => (
                        <div className="flex flex-wrap gap-1">
                            {lecturer.prefrredSlots.length > 0 ? (
                                lecturer.prefrredSlots.slice(0, 2).map((slot, index) => (
                                    <Badge key={index} variant="outline" className="mr-1 mb-1">
                                        {slot.day} {formatTime(slot.starTime)} - {formatTime(slot.endTime)}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">No preferences set</span>
                            )}
                            {lecturer.prefrredSlots.length > 2 && (
                                <Badge variant={"outline"}>+{lecturer.prefrredSlots.length - 2} more</Badge>
                            )}
                        </div>
                    )
                },
                {
                    header: "Actions", accessorKey: "id",
                    cell: (lecture: Lecture) => (
                        <div className="flex justify-end gap-2">
                            <EditButton onEdit={() => onEdit(lecture)} />
                            <DeleteButton onDelete={() => onDelete(lecture)} />
                            <Button variant="outline" size="sm" onClick={() => onAddPrefrence(lecture)}>
                                <Clock className="mr-2 h-4 w-4" />
                                Preferences
                            </Button>
                        </div>
                    )
                }
            ]}
            isLoading={isPending}
            emptyMessage="No lecture found."
            filterBy={[
                { label: "Nama", value: "name" },
                { label: "NIP", value: "nip" },
                { label: "Preferensi", value: "preference" }
            ]}
        />
    )
}