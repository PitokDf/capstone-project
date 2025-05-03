import { Course, Lecture, Room, Schedule, TimeSlot } from "@prisma/client";

function isValidAssignment(
    lecturer: Lecture,
    room: Room,
    timeSlot: TimeSlot,
    schedule: Array<Omit<Schedule, "id">>
): boolean {
    for (const entry of schedule) {
        if (entry.roomID === room.id && entry.timeSlotID === timeSlot.id) return false;
        if (entry.lectureID === lecturer.id && entry.timeSlotID === timeSlot.id) return false;
    }

    if (lecturer.preference && lecturer.preference !== timeSlot.day) return false;

    return true;
}

function countRoomUsage(schedule: Array<Omit<Schedule, "id">>): Map<number, number> {
    const roomUsage = new Map<number, number>();
    for (const entry of schedule) {
        roomUsage.set(entry.roomID, (roomUsage.get(entry.roomID) || 0) + 1);
    }
    return roomUsage;
}


export const backtrack = (
    courses: Array<Course>,
    lectures: Array<Lecture>,
    rooms: Array<Room>,
    timeSlots: Array<TimeSlot>,
    schedule: Array<Omit<Schedule, "id">>,
    courseIndex: number = 0
): boolean => {
    if (courseIndex >= courses.length) return true;

    const course = courses[courseIndex];
    const roomUsage = countRoomUsage(schedule);
    const sortedRooms = rooms.slice().sort((a, b) => {
        const usageA = roomUsage.get(a.id) || 0;
        const usageB = roomUsage.get(b.id) || 0;
        return usageA - usageB;
    });
    for (const lecturer of lectures) {
        for (const room of sortedRooms) {
            for (const timeSlot of timeSlots) {
                if (isValidAssignment(lecturer, room, timeSlot, schedule)) {
                    schedule.push({
                        courseID: course.id,
                        lectureID: lecturer.id,
                        roomID: room.id,
                        timeSlotID: timeSlot.id
                    });

                    if (backtrack(courses, lectures, rooms, timeSlots, schedule, courseIndex + 1)) {
                        return true;
                    }

                    schedule.pop();
                }
            }
        }
    }

    return false;
};
