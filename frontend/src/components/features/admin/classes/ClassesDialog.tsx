import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const classSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters")
})

export type ClassFormValues = z.infer<typeof classSchema> & { id?: number }
interface ServerError { path: string; msg: string }

interface ClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: ClassFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: ClassFormValues & { id?: number };
}
export function ClassDialog({
    open,
    onOpenChange,
    onSave,
    title,
    onLoading,
    serverErrors,
    defaultValues = {
        code: "",
        name: ""
    }
}: ClassDialogProps) {

    useEffect(() => {
        if (open && title === "Edit Class") form.reset(defaultValues)
    }, [open])

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof ClassFormValues).invalid === false) {
                form.setError(e.path as keyof ClassFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        await onSave(defaultValues.id ? { ...data, id: defaultValues.id } : data)
        form.reset()
        onOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for class below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., T3B" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., TRPL3B" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant={"outline"} onClick={() => { onOpenChange(false) }}>Cancel</Button>
                            <Button disabled={onLoading} type="submit">Save {onLoading && <LoaderCircle className='animate-spin' />} </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}