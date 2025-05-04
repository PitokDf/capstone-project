import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

type EditButtonProps = {
    className?: string;
    onEdit: () => void;
}

export function EditButton({
    className, onEdit
}: EditButtonProps) {
    return (
        <Button variant={"ghost"} className={`cursor-pointer ${className}`} size={"icon"} onClick={onEdit}>
            <Pencil className="h-4 w-4 text-orange-500" />
        </Button>
    )
}