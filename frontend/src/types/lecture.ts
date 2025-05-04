export interface Lecture {
    id: number
    nip: string
    name: string
    preference: string

    prefrredSlots: {
        day: string,
        timeslotID: number,
        starTime: Date,
        endTime: Date
    }[]
}