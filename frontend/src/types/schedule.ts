

export interface Schedule {
    id: number
    classID: number
    className?: string
    courseID: number
    courseName?: string
    lecturerID: number
    lecturerName?: string
    roomID: number
    roomName?: string
    day?: string
    startTime?: string
    endTime?: string
    color: string
}