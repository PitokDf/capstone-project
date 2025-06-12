"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ScheduleItem } from "../dashboard/WeeklySchedule";
import { formatTime } from "@/lib/utils";

interface DailyScheduleProps {
  filterType: string;
  filterValue: string;
}

export function DailySchedule({ filterType, filterValue }: DailyScheduleProps) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { isPending, data: scheduleData } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/schedule`);
      return res.data.data as ScheduleItem[];
    },
    queryKey: ["schedules"]
  });

  if (isPending || !scheduleData) return (
    <p>Loadin...</p>
  )

  // Filter schedules based on selected day and other filters
  const filteredSchedules = scheduleData?.filter(schedule => {
    const dayMatch = schedule.day === selectedDay;
    const filterMatch = filterType === "all" ? true :
      filterType === "class" ? schedule.classID.toString() === filterValue :
        filterType === "lecturer" ? schedule.lecturerID.toString() === filterValue :
          filterType === "room" ? schedule.roomID.toString() === filterValue : true;

    return dayMatch && filterMatch;
  });

  // Sort schedules by start time
  const sortedSchedules = [...filteredSchedules].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-48 space-y-2">
          <Label>Select Day</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSchedules.length === 0 ? (
          <Card className="p-8 text-center h-[100px] text-muted-foreground">
            No schedules found for {selectedDay}
          </Card>
        ) : (
          sortedSchedules.map(schedule => (
            <Card key={schedule.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-xl font-semibold">{schedule.courseName}</div>
                  <div className="text-muted-foreground">{schedule.className}</div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Lecturer</div>
                  <div>{schedule.lecturerName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Room</div>
                  <div>{schedule.roomName}</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}