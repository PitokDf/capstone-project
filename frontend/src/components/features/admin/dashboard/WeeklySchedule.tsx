"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn, formatTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { getTimeslots } from "@/lib/api/timeslot";
import { Timeslot } from "@/types/timeslot";

export type ScheduleItem = {
  id: string;
  classID: string;
  className: string;
  courseID: string;
  courseName: string;
  lecturerID: string;
  lecturerName: string;
  roomID: string;
  roomName: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
};

interface WeeklyScheduleProps {
  filterType: string;
  filterValue: string;
}

// Helper to convert time string to minutes for comparison
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper to sort time slots
const sortTimeSlots = (a: string, b: string): number => {
  const [aStart] = a.split("-");
  const [bStart] = b.split("-");
  return timeToMinutes(aStart) - timeToMinutes(bStart);
};

// Helper to sort days of the week
const sortDays = (a: string, b: string): number => {
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return daysOrder.indexOf(a) - daysOrder.indexOf(b);
};

// Helper to check if scheduleItem belongs to the timeSlot
const isInTimeSlot = (scheduleItem: ScheduleItem, timeSlot: string): boolean => {
  const [slotStart, slotEnd] = timeSlot.split("-");
  const itemStartMinutes = timeToMinutes(scheduleItem.startTime);
  const itemEndMinutes = timeToMinutes(scheduleItem.endTime);
  const slotStartMinutes = timeToMinutes(slotStart);
  const slotEndMinutes = timeToMinutes(slotEnd);

  // Check if the item overlaps with this timeslot
  return (
    (itemStartMinutes >= slotStartMinutes && itemStartMinutes < slotEndMinutes) ||
    (itemEndMinutes > slotStartMinutes && itemEndMinutes <= slotEndMinutes) ||
    (itemStartMinutes <= slotStartMinutes && itemEndMinutes >= slotEndMinutes)
  );
};

export function WeeklySchedule({ filterType, filterValue }: WeeklyScheduleProps) {
  const { isPending, data: scheduleData } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance.get(`/schedule`);
      return res.data.data as ScheduleItem[];
    },
    queryKey: ["schedules"]
  });

  const { data: timeslotsData } = useQuery({
    queryFn: getTimeslots,
    queryKey: ["timeslots"]
  });

  if (isPending || !timeslotsData) return <p>Loading...</p>;

  // Filter the schedule based on the selected filter
  const filteredSchedule = scheduleData?.filter(item => {
    if (filterType === "all") return true;
    if (filterType === "class" && filterValue) { return item.classID.toString() === filterValue };
    if (filterType === "lecturer" && filterValue) return item.lecturerID.toString() === filterValue;
    if (filterType === "room" && filterValue) return item.roomID.toString() === filterValue;
    return true;
  });

  // Extract unique time slots from time slots data and sort them
  const timeSlots = Array.from(
    new Set(
      (timeslotsData as Timeslot[])?.map(slot => `${formatTime(slot.starTime)}-${formatTime(slot.endTime)}`)
    )
  ).sort(sortTimeSlots);

  // Extract unique days from time slots data and sort them
  const days = Array.from(
    new Set(
      (timeslotsData as Timeslot[])?.map(slot => slot.day)
    )
  ).sort(sortDays);

  // Function to get schedule items for a specific day and time slot
  const getScheduleItems = (day: string, timeSlot: string): ScheduleItem[] => {
    if (!filteredSchedule) return [];

    return filteredSchedule.filter(item =>
      item.day === day && isInTimeSlot(item, timeSlot)
    );
  };

  return (
    <div className=" overflow-x-auto">
      <div className="render-colors">
        <div className="bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800 hidden">hidden</div>
        <div className="bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800 hidden">hidden</div>
        <div className="bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800 hidden">hidden</div>
        <div className="bg-purple-100 border-purple-300 dark:bg-purple-950 dark:border-purple-800 hidden">hidden</div>
        <div className="bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800 hidden">hidden</div>
        <div className="bg-teal-100 border-teal-300 dark:bg-teal-950 dark:border-teal-800 hidden">hidden</div>
        <div className="bg-indigo-100 border-indigo-300 dark:bg-indigo-950 dark:border-indigo-800 hidden">hidden</div>
      </div>
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th className="border p-2 bg-muted font-medium text-muted-foreground">Time / Day</th>
            {days.map(day => (
              <th key={day} className="border p-2 bg-muted font-medium w-1/6">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(timeSlot => (
            <tr key={timeSlot}>
              <td className="border p-2 bg-muted/50 font-medium text-muted-foreground text-sm">
                {timeSlot}
              </td>
              {days.map(day => {
                const scheduleItems = getScheduleItems(day, timeSlot);
                return (
                  <td key={`${day}-${timeSlot}`} className="border p-0 h-24 relative">
                    {scheduleItems.length > 0 ? (
                      scheduleItems.length === 1 ? (
                        // Single schedule item
                        <SingleScheduleItem scheduleItem={scheduleItems[0]} />
                      ) : (
                        // Multiple schedule items
                        <MultipleScheduleItems scheduleItems={scheduleItems} />
                      )
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Component for a single schedule item
function SingleScheduleItem({ scheduleItem }: { scheduleItem: ScheduleItem }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-2 h-full flex flex-col justify-between cursor-pointer bg-${scheduleItem.color}-100 border-${scheduleItem.color}-300 dark:bg-${scheduleItem.color}-950 dark:border-${scheduleItem.color}-800`}>
            <div>
              <div className="font-medium">{scheduleItem.courseName}</div>
              <div className="text-sm">{scheduleItem.className}</div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <Badge variant="outline" className="w-fit text-xs">
                {scheduleItem.lecturerName}
              </Badge>
              <Badge variant="outline" className="w-fit text-xs">
                Room: {scheduleItem.roomName}
              </Badge>
              <Badge variant="outline" className="w-fit text-xs">
                {scheduleItem.startTime} - {scheduleItem.endTime}
              </Badge>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-0 overflow-hidden">
          <div className="p-4 max-w-xs">
            <div className="font-bold mb-2">{scheduleItem.courseName}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class:</span>
                <span>{scheduleItem.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lecturer:</span>
                <span className="">{scheduleItem.lecturerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span>{scheduleItem.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{scheduleItem.startTime} - {scheduleItem.endTime}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Component for multiple overlapping schedule items
function MultipleScheduleItems({ scheduleItems }: { scheduleItems: ScheduleItem[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 h-full flex flex-col justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div>
              <div className="font-medium text-sm">Multiple Classes</div>
              <div className="text-xs text-muted-foreground">{scheduleItems.length} classes scheduled</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {scheduleItems.map((item, idx) => (
                <Badge key={idx} className={cn("text-xs", item.color.replace("bg-", "bg-opacity-70 "))}>
                  {item.courseName}
                </Badge>
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-0 overflow-hidden max-w-md">
          <div className="p-4">
            <div className="font-bold mb-2">Overlapping Classes</div>
            <div className="space-y-4">
              {scheduleItems.map((item, idx) => (
                <div key={idx} className={cn("p-2 rounded", item.color)}>
                  <div className="font-medium">{item.courseName}</div>
                  <div className="space-y-1 text-sm mt-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span>{item.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lecturer:</span>
                      <span>{item.lecturerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span>{item.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


// import React, { useEffect, useState } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";
// import { cn, formatTime } from "@/lib/utils";
// import axiosInstance from "@/lib/axios";

// interface ScheduleEntry {
//   id: number;
//   classID: string;
//   className: string;
//   courseID: string;
//   courseName: string;
//   lecturerID: string;
//   lecturerName: string;
//   roomID: string;
//   roomName: string;
//   color: string;
// }

// interface TimeSlotAPI {
//   id: number;
//   day: string;
//   starTime: string;
//   endTime: string;
//   Schedule: ScheduleEntry[];
// }

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// export function WeeklySchedule({ filterType, filterValue }: { filterType: string; filterValue: string; }) {
//   const [timeSlots, setTimeSlots] = useState<TimeSlotAPI[]>([]);
//   const [loading, setLoading] = useState(true);

//   // fetch timeSlots with nested schedules
//   useEffect(() => {
//     async function fetchSlots() {
//       try {
//         // const res = await fetch(`/api/timeSlots?filterType=${filterType}&filterValue=${filterValue}`);
//         // const json = await res.json();
//         const res = await axiosInstance.get("/timeslot")
//         // API returns { message, data }
//         const slots: TimeSlotAPI[] = res.data.data;
//         // Sort by start time
//         slots.sort((a, b) => a.starTime.localeCompare(b.starTime));
//         setTimeSlots(slots);

//       } catch (err) {
//         console.error("Failed to fetch timeSlots", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchSlots();
//   }, [filterType, filterValue]);

//   if (loading) return <div className="p-4 text-center">Loading schedule...</div>;

//   // derive unique labels for rows: combine start-end across days
//   const uniqueLabels = Array.from(
//     new Set(
//       timeSlots.map(ts => `${formatTime(ts.starTime)}-${formatTime(ts.endTime)}`)
//     )
//   );

//   const getEntry = (day: string, label: string) => {
//     const [start, end] = label.split("-"); // 08:00-10:00 ==> 08:00
//     const slot = timeSlots.find(ts => ts.day === day && formatTime(ts.starTime) === start); // 
//     if (!slot || slot.Schedule.length === 0) return null;

//     return slot.Schedule[0];
//   };

//   return (
//     <div className="overflow-auto">
//       <table className="w-full border-collapse min-w-[800px]">
//         <thead>
//           <tr>
//             <th className="border p-2 bg-muted font-medium text-muted-foreground">Time / Day</th>
//             {days.map(day => (
//               <th key={day} className="border p-2 bg-muted font-medium w-1/6">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {uniqueLabels.map(label => (
//             <tr key={label}>
//               <td className="border p-2 bg-muted/50 font-medium text-muted-foreground text-sm">{label}</td>
//               {days.map(day => {
//                 const entry = getEntry(day, label);
//                 return (
//                   <td key={`${day}-${label}`} className="border p-0 h-24 relative">
//                     {entry && (
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <div
//                               className={cn(
//                                 "p-2 h-full flex flex-col justify-between cursor-pointer",
//                                 entry.color
//                               )}
//                             >
//                               <div>
//                                 <div className="font-medium text-sm">{entry.courseName}</div>
//                                 <div className="text-xs">{entry.className}</div>
//                               </div>
//                               <div className="mt-2 flex flex-col gap-1">
//                                 <Badge variant="outline" className="w-fit text-xs">{entry.lecturerName}</Badge>
//                                 <Badge variant="outline" className="w-fit text-xs">{entry.roomName}</Badge>
//                               </div>
//                             </div>
//                           </TooltipTrigger>
//                           <TooltipContent className="p-0 overflow-hidden">
//                             <div className="p-4 text-sm">
//                               <div className="font-bold mb-2">{entry.courseName}</div>
//                               <div className="space-y-1">
//                                 <div className="flex justify-between"><span>Class:</span><span>{entry.className}</span></div>
//                                 <div className="flex justify-between"><span>Lecturer:</span><span>{entry.lecturerName}</span></div>
//                                 <div className="flex justify-between"><span>Room:</span><span>{entry.roomName}</span></div>
//                                 <div className="flex justify-between"><span>Time:</span><span>{label}</span></div>
//                               </div>
//                             </div>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

