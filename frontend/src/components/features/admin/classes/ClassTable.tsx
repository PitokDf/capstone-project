'use client'

import { DataTable } from "@/components/ui/data-table";
import { getClasses } from "@/lib/api/class";
import { useQuery } from "@tanstack/react-query";

export function ClassTable() {
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
            ]}
            isLoading={isPending}
            emptyMessage="No classes found"
        />
    )
}