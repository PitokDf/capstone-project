import { AddClass } from "@/components/features/admin/classes/AddClass";
import { ClassTable } from "@/components/features/admin/classes/ClassTable";

export default function ClassesPage() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
                    <p className="text-muted-foreground">
                        Manage all your university classes here.
                    </p>
                </div>
                <AddClass />
            </div>
            <ClassTable />
        </div>
    )
}