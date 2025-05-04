'use client'

import { AddClass } from "@/components/features/admin/classes/AddClass";
import { ClassTable } from "@/components/features/admin/classes/ClassTable";
import { DeleteClass } from "@/components/features/admin/classes/DeleteClass";
import { EditClass } from "@/components/features/admin/classes/EditClass";
import { Class } from "@/types/class";
import { useEffect, useState } from "react";

export default function ClassesPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [currentClass, setCurrentClass] = useState<Class | null>(null)

    const handleEditDialog = (classes: Class) => {
        setCurrentClass(classes)
        setIsEditDialogOpen(true)
    }
    const handleDeleteDialog = (classes: Class) => {
        setCurrentClass(classes)
        setIsDeleteDialogOpen(true)
    }

    useEffect(() => { document.title = "Classes - Admin" }, [])
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
            <ClassTable
                onDelete={handleDeleteDialog}
                onEdit={handleEditDialog}
            />

            {currentClass && isEditDialogOpen && (
                <EditClass
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    data={currentClass}
                />
            )}

            {currentClass && isDeleteDialogOpen && (
                <DeleteClass
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    data={currentClass}
                />
            )}
        </div>
    )
}