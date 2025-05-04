'use client'

import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import { DataTable } from "@/components/ui/data-table";
import { getClasses } from "@/lib/api/class";
import { Class } from "@/types/class";
import { useQuery } from "@tanstack/react-query";

type ClassTableProps = {
    onEdit: (classes: Class) => void
    onDelete: (classes: Class) => void
}

export function ClassTable({
    onDelete, onEdit
}: ClassTableProps) {
    const { data, isPending } = useQuery({
        queryFn: getClasses,
        queryKey: ["classes"]
    })
    return (
        <DataTable
            data={data!}
            columns={[
                { header: "Code", accessorKey: "code" },
                { header: "Name", accessorKey: "name" },
                {
                    header: "Actions", accessorKey: "id",
                    cell: (data) => (
                        <div className="flex justify-end gap-2">
                            <EditButton onEdit={() => onEdit(data)} />
                            <DeleteButton onDelete={() => onDelete(data)} />
                        </div>
                    )
                }
            ]}
            isLoading={isPending}
            emptyMessage="No classes found"
        />
    )
}