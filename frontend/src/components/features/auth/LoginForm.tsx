'use client'

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Email tida valid."),
    password: z.string().min(1, { message: "Password minimal 2 karakter." })
})

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post('/auth/login', data);
            if (response.status === 200) {
                toast("Login berhasil", {
                    description: "Silahkan tunggu, kamu sedang dialihkan."
                })
                const token = response.data.data.token;
                localStorage.setItem('auth_token', token)
                // document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60 * 1000}; ${process.env.NEXT_PUBLIC_NODE_ENV === "production" && "Secure"}; SameSite=None`
                location.href = "/admin"
            }
        } catch (error: any) {
            console.log(error);
            setError(error.response.data.message)
        } finally { setIsLoading(false) }
    }

    return (
        <>
            {error &&
                <Alert className="bg-red-100 dark:bg-red-700/20 mb-4">
                    <AlertDescription className="dark:text-red-200">{error}</AlertDescription>
                </Alert>
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>You Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter you email." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>You Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter you password." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Form>
        </>
    )
}