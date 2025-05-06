import { useEffect } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type ServerError<T> = {
    path: keyof T;
    msg: string;
}[];

export function useApplyServerErrors<T extends FieldValues>(
    form: UseFormReturn<T>,
    serverErrors?: ServerError<T>
) {
    useEffect(() => {
        if (!serverErrors) return;

        serverErrors.forEach(error => {
            const path = error.path;
            const fieldState = form.getFieldState(path as Path<T>);
            if (!fieldState.invalid) {
                form.setError(path as Path<T>, {
                    type: "server",
                    message: error.msg,
                });
            }
        });
    }, [serverErrors, form]);
}
