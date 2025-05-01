import { CalendarDays, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
    id: number;
    courseCode: string;
    courseName: string;
    lecturer: string;
    room: string;
    day: string;
    time: string;
    updated: string;
}

const recentSchedules: ScheduleItem[] = [
    {
        id: 1,
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        lecturer: "Dr. Alan Turing",
        room: "R201",
        day: "Monday",
        time: "08:00 - 10:00",
        updated: "2 hours ago"
    },
    {
        id: 2,
        courseCode: "MATH202",
        courseName: "Advanced Calculus",
        lecturer: "Dr. Ada Lovelace",
        room: "R105",
        day: "Wednesday",
        time: "13:00 - 15:00",
        updated: "5 hours ago"
    },
    {
        id: 3,
        courseCode: "ENG101",
        courseName: "Academic Writing",
        lecturer: "Prof. William Shakespeare",
        room: "R302",
        day: "Friday",
        time: "10:00 - 12:00",
        updated: "1 day ago"
    },
    {
        id: 4,
        courseCode: "PHYS101",
        courseName: "Physics I",
        lecturer: "Dr. Albert Einstein",
        room: "R401",
        day: "Thursday",
        time: "15:00 - 17:00",
        updated: "2 days ago"
    }
];

export function RecentSchedules() {
    return (
        <div className="space-y-8">
            {recentSchedules.map((schedule) => (
                <div key={schedule.id} className="flex gap-4 items-start">
                    <div className="rounded-full p-2 bg-primary/10">
                        <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            <span className="font-bold">{schedule.courseCode}</span> - {schedule.courseName}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{schedule.lecturer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{schedule.room}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                <span>{schedule.day}, {schedule.time}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                        Updated {schedule.updated}
                    </div>
                </div>
            ))}
        </div>
    );
}