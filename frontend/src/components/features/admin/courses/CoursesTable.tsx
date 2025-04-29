"use client"

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/course";

interface Props {
    data: Course[];
    isLoading: boolean;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
    pageSize: number;
}

export const CoursesTable = ({
    data,
    isLoading,
    onEdit,
    onDelete,
    pageSize,
}: Props) => {
    return (
        <DataTable
            isLoading={isLoading}
            data={data}
            columns={[
                { header: "Code", accessorKey: "code" },
                { header: "Name", accessorKey: "name" },
                { header: "SKS", accessorKey: "sks" },
                { header: "Duration (min)", accessorKey: "duration" },
                {
                    header: "Actions",
                    accessorKey: "id",
                    cell: (course: Course) => (
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(course)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                }
            ]}
            filterBy={[
                { label: "Code", value: "code" },
                { label: "Name", value: "name" },
                { label: "SKS", value: "sks" },
                { label: "Duration", value: "duration" }
            ]}
            pageSize={pageSize}
            emptyMessage="No courses found."
        />
    );
};
