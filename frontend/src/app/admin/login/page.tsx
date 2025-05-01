'use client'

import ThemeToggle from "@/components/ui/themeToogle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/lib/axios"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    email: z.string().email('Email tidak valid.').and(z.string().nonempty('Email tidak boleh kosong.')),
    password: z.string()
})

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleLogin = async (data: FormData) => {
        console.log(data.email);
        try {
            const response = await axiosInstance.post('/auth/login', data);
            if (response.status === 200) {
                toast("Login berhasil", {
                    description: "Silahkan tunggu, kamu sedang dialihkan.",
                    duration: 2000
                })

                router.push("/admin")
            }
        } catch (error: any) {
            console.log(error);
            setError(error.response.data.message)
        }

    }

    return (
        <div className={cn("min-h-screen flex items-center justify-center", "bg-gradient-to-b from-background to-muted")}>
            <Card className="w-full max-w-md shadow-2xl">
                <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className={cn("text-2xl font-bold", "text-gray-800 dark:text-white")}>Admin Login</h1>
                        <ThemeToggle />
                    </div>

                    {error &&
                        <Alert className="bg-red-100">
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    }

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="admin@web.com" required className="mt-1" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password')} placeholder="••••••••" required className="mt-1" />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}