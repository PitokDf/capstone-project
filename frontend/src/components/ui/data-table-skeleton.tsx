import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export function DataTableSkeleton({ columns }: { columns: { header: string }[] }) {
    return (
        <>
            <div className="flex items-center mb-6 gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Skeleton className="h-9" />
                </div>
                <Skeleton className="h-9 w-[100px]" />
            </div>
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((value, index) => (
                                    <TableHead key={index}>
                                        {value.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                Array.from({ length: 10 }, (_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="w-full h-6" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[200px]" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-[40px]" />
                        <Skeleton className="h-9 w-[40px]" />
                    </div>
                </div>
            </div>
        </>
    );
}