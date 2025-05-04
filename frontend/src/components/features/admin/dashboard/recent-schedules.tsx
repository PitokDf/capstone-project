"use client"

import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const schedules = [
  {
    id: "SCH-001",
    class: "CS-2A",
    course: "Algorithms",
    lecturer: "Dr. Jane Smith",
    room: "A-201",
    day: "Monday",
    time: "10:00 - 11:30",
    status: "Active"
  },
  {
    id: "SCH-002",
    class: "IT-3B",
    course: "Web Development",
    lecturer: "Prof. Robert Johnson",
    room: "B-103",
    day: "Tuesday",
    time: "13:00 - 14:30",
    status: "Active"
  },
  {
    id: "SCH-003",
    class: "CS-4A",
    course: "Machine Learning",
    lecturer: "Dr. Sarah Wilson",
    room: "C-105",
    day: "Wednesday",
    time: "09:00 - 10:30",
    status: "Pending"
  },
  {
    id: "SCH-004",
    class: "IT-2C",
    course: "Database Systems",
    lecturer: "Prof. Michael Brown",
    room: "A-105",
    day: "Thursday",
    time: "14:00 - 15:30",
    status: "Active"
  },
  {
    id: "SCH-005",
    class: "CS-3B",
    course: "Software Engineering",
    lecturer: "Dr. Emily Davis",
    room: "B-202",
    day: "Friday",
    time: "11:00 - 12:30",
    status: "Pending"
  }
];

export function RecentSchedules() {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Day & Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.id}</TableCell>
              <TableCell>{schedule.class}</TableCell>
              <TableCell>{schedule.course}</TableCell>
              <TableCell>{schedule.lecturer}</TableCell>
              <TableCell>{schedule.room}</TableCell>
              <TableCell>{schedule.day}, {schedule.time}</TableCell>
              <TableCell>
                <Badge variant={schedule.status === "Active" ? "default" : "secondary"}>
                  {schedule.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}