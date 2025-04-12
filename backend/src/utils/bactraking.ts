import { Course, Lecture, Room, Schedule, TimeSlot } from '@prisma/client'

function isValidAssignment(
    lecturer: Lecture,
    room: Room,
    timeSlot: TimeSlot,
    schedule: Array<Omit<Schedule, "id">>) {

    for (const entry of schedule) {
        if (entry.roomID === room.id && entry.timeSlotID === timeSlot.id) {
            return false;
        }
        if (entry.lectureID === lecturer.id && entry.timeSlotID === timeSlot.id) {
            return false;
        }
    }

    if (lecturer.preference && lecturer.preference !== timeSlot.day) {
        return false;
    }
}

const bactrack = (
    courses: Array<Course>,
    lectures: Array<Lecture>,
    rooms: Array<Room>,
    timeSlots: Array<TimeSlot>,
    schedule: Array<Omit<Schedule, "id">>,
    courseIndex: number = 0
) => {

    if (courseIndex >= courses.length) {
        return true;
    }

    const course = courses[courseIndex]

    for (const lecturer of lectures) {
        for (const room of rooms) {
            for (const timeSlot of timeSlots) {
                if (isValidAssignment(lecturer, room, timeSlot, schedule)) {
                    schedule.push({
                        courseID: course.id,
                        lectureID: lecturer.id,
                        roomID: room.id,
                        timeSlotID: timeSlot.id
                    });

                    if (bactrack(courses, lectures, rooms, timeSlots, schedule, courseIndex + 1)) {
                        return true;
                    }

                    schedule.pop()
                }
            }
        }
    }

    return false;
}

export const scheduleCourses = async (
    courses: Array<Course>,
    lectures: Array<Lecture>,
    rooms: Array<Room>,
    timeSlots: Array<TimeSlot>,
) => {

    const schedule: Array<Omit<Schedule, "id">> = [];
    const success = bactrack(courses, lectures, rooms, timeSlots, schedule);

    if (success) { return schedule; }
    else { return null; }
}