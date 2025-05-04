import ThemeToggle from "@/components/ui/themeToogle"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import { LoginForm } from "@/components/features/auth/LoginForm"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login Admin',
    description: "Masuk untuk memenej system penjadwalan mata kuliah"
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex justify-between items-center">
                        <ThemeToggle />
                    </div>
                    <div className="flex justify-center mb-4">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <GraduationCap size={36} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">University Scheduler</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the admin dashboard
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col">
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Manage system course schedule. <br />
                        Kembali ke  <a href="/" className="text-blue-500">halaman utama</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}