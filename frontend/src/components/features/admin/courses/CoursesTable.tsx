"use client"

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import { EditButton } from "@/components/EditButton";
import { DeleteButton } from "@/components/DeleteButton";

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
                            <EditButton onEdit={() => onEdit(course)} />
                            <DeleteButton onDelete={() => onDelete(course)} />
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
