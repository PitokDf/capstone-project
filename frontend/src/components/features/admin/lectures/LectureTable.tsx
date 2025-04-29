import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getLectures } from "@/lib/api/lecture";
import { Lecture } from "@/types/lecture";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

interface LectureTableProps {
    data: Lecture[];
    isLoading: boolean;
    onEdit: (lecture: Lecture) => void;
    onDelete: (lecture: Lecture) => void;
}

export function LectureTable({
    data, isLoading, onDelete, onEdit
}: LectureTableProps) {
    const { data: lectures, isPending } = useQuery({
        queryKey: ["lectures"],
        queryFn: getLectures
    })
    return (
        <DataTable
            data={lectures}
            columns={[
                { header: "NIP", accessorKey: "nip" },
                { header: "Nama", accessorKey: "name" },
                { header: "Preferensi", accessorKey: "preference" },
                {
                    header: "Actions", accessorKey: "id",
                    cell: (lecture: Lecture) => (
                        <div className="flex justify-end gap-2">
                            <Button variant={"ghost"} size={"icon"} onClick={() => onEdit(lecture)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant={"ghost"} size={"icon"} onClick={() => onDelete(lecture)}>
                                <Trash2 className="h-4 w-4" />
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
            ]}
        />
    )
}