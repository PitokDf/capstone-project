import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "./skeleton";
import { Search } from "lucide-react";
import { Input } from "./input";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { DataTableSkeleton } from "./data-table-skeleton";

interface DataTableProps<T> {
    data: T[];
    columns: {
        header: string;
        accessorKey: keyof T;
        cell?: (item: T) => React.ReactNode;
    }[];
    filterBy?: {
        label: string;
        value: keyof T;
    }[];
    isLoading: boolean;
    pageSize?: number;
    totalItems: number;
    emptyMessage?: string;
}

export function DataTable<T>({
    data,
    columns,
    isLoading = true,
    pageSize = 10,
    filterBy,
    emptyMessage = "No items found.",
}: DataTableProps<T>) {

    if (isLoading) {
        return (
            <DataTableSkeleton columns={columns} />
        )
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<keyof T | "__ALL__">("__ALL__");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = data.filter((item: any) => {
        if (searchTerm && filter) {
            if (filter === "__ALL__") {
                return Object.values(item).some((value: any) => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    if (typeof value === 'number') {
                        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    return false;
                });
            }
            else {
                const itemValue = item[filter];
                if (typeof itemValue === 'string') {
                    return itemValue.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (typeof itemValue === 'number') {
                    return String(itemValue).toLowerCase().includes(searchTerm.toLowerCase());
                }
            }
            return false;
        }
        return true;
    })

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const totalItems = filteredData.length;

    return (
        <>
            <div className="flex items-center mb-6 gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filterBy && filterBy.length > 0 && (
                    <Select onValueChange={(value) => {
                        setCurrentPage(1)
                        setFilter(value as keyof T);
                    }}>
                        <SelectTrigger className="max-w-max">
                            <SelectValue placeholder="Filter by: " />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Filter by</SelectLabel>
                                <SelectItem value={"__ALL__"}>All</SelectItem>
                                {filterBy.sort((a, b) => a.label.localeCompare(b.label)).map((column, index) => (
                                    <SelectItem key={index} value={column.value as string}>
                                        {column.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={index}>{column.header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center h-24 text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((column, colIndex) => (
                                            <TableCell key={colIndex}>
                                                {column.cell
                                                    ? column.cell(item)
                                                    : (item[column.accessorKey] as React.ReactNode)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{" "}
                        {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </>
    );
}