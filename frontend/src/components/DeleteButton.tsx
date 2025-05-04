import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

type DeleteButtonProps = {
    className?: string;
    onDelete: () => void;
}

export function DeleteButton({
    className, onDelete
}: DeleteButtonProps) {
    return (
        <Button variant={"ghost"} className={`cursor-pointer ${className}`} size={"icon"} onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
    )
}