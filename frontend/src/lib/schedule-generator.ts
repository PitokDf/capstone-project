// Types based on our database schema
interface Course {
    id: number;
    code: string;
    name: string;
    sks: number;
    duration: number;
}

interface Lecture {
    id: number;
    nip: string;
    name: string;
    preference: string;
}

interface Room {
    id: number;
    code: string;
    name: string;
    capacity: string;
    location: string;
}

interface TimeSlot {
    id: number;
    day: string;
    starTime: Date;
    endTime: Date;
}

interface Schedule {
    courseID: number;
    lectureID: number;
    roomID: number;
    timeSlotID: number;
}

interface Assignment {
    course: Course;
    lecture: Lecture;
    room: Room;
    timeSlot: TimeSlot;
}

export class ScheduleGenerator {
    private courses: Course[];
    private lectures: Lecture[];
    private rooms: Room[];
    private timeSlots: TimeSlot[];
    private assignments: Assignment[];

    constructor(
        courses: Course[],
        lectures: Lecture[],
        rooms: Room[],
        timeSlots: TimeSlot[]
    ) {
        this.courses = courses;
        this.lectures = lectures;
        this.rooms = rooms;
        this.timeSlots = timeSlots;
        this.assignments = [];
    }

    generate(): Assignment[] {
        this.assignments = [];
        const unassignedCourses = [...this.courses];

        if (this.backtrack(unassignedCourses)) {
            return this.assignments;
        }

        throw new Error("No valid schedule found");
    }

    private backtrack(unassignedCourses: Course[]): boolean {
        // Base case: all courses are assigned
        if (unassignedCourses.length === 0) {
            return true;
        }

        const course = unassignedCourses[0];
        const remainingCourses = unassignedCourses.slice(1);

        // Try all possible combinations
        for (const lecture of this.lectures) {
            if (!this.isLectureAvailable(lecture)) continue;

            for (const room of this.rooms) {
                if (!this.isRoomSuitable(room, course)) continue;

                for (const timeSlot of this.timeSlots) {
                    if (!this.isTimeSlotAvailable(timeSlot, lecture, room)) continue;

                    // Try this assignment
                    const assignment: Assignment = {
                        course,
                        lecture,
                        room,
                        timeSlot
                    };

                    this.assignments.push(assignment);

                    // Recursively try to assign remaining courses
                    if (this.backtrack(remainingCourses)) {
                        return true;
                    }

                    // If we get here, this assignment didn't work
                    this.assignments.pop();
                }
            }
        }

        return false;
    }

    private isLectureAvailable(lecture: Lecture): boolean {
        // Check lecturer's existing assignments
        const lectureAssignments = this.assignments.filter(
            a => a.lecture.id === lecture.id
        );

        // Simple rule: don't overload lecturers
        return lectureAssignments.length < 4; // Max 4 courses per lecturer
    }

    private isRoomSuitable(room: Room, course: Course): boolean {
        // Simple capacity check (assuming room capacity is a number string)
        return parseInt(room.capacity) >= 20; // Assuming minimum class size
    }

    private isTimeSlotAvailable(
        timeSlot: TimeSlot,
        lecture: Lecture,
        room: Room
    ): boolean {
        // Check if this time slot is already used by this lecturer or room
        return !this.assignments.some(assignment => {
            const sameTimeSlot = assignment.timeSlot.id === timeSlot.id;
            const sameLecturer = assignment.lecture.id === lecture.id;
            const sameRoom = assignment.room.id === room.id;

            return sameTimeSlot && (sameLecturer || sameRoom);
        });
    }

    private checkLecturerPreference(lecture: Lecture, timeSlot: TimeSlot): boolean {
        // Parse lecturer preferences
        const preference = lecture.preference.toLowerCase();
        const timeSlotHour = timeSlot.starTime.getHours();

        if (preference.includes('morning') && timeSlotHour >= 12) return false;
        if (preference.includes('afternoon') && timeSlotHour < 12) return false;
        if (preference.includes('no friday') && timeSlot.day.toLowerCase() === 'friday') return false;

        return true;
    }
}