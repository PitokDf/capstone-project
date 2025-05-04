import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardListIcon, GraduationCap, Users } from "lucide-react";

export function Total({
    totalClasses, totalCourses, totalLectures
}: {
    totalClasses: number
    totalLectures: number
    totalCourses: number
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Classes
                    </CardTitle>
                    <Users />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalClasses}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Lecturers
                    </CardTitle>
                    <GraduationCap />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalLectures}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses</CardTitle>
                    <ClipboardListIcon />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCourses}</div>
                </CardContent>
            </Card>
        </div>
    )
}