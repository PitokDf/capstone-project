import { Class } from "./class"
import { Course } from "./course"
import { Lecture } from "./lecture"
import { Room } from "./room"
import { Timeslot } from "./timeslot"

export interface Schedule {
    id: number
    classID: number
    class?: Class
    courseID: number
    course?: Course
    lectureID: number
    lecture?: Lecture
    roomID: number
    room?: Room
    timeSlotID: number
    timeSlot?: Timeslot
}