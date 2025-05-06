export interface Schedule {
    courseID: number;
    classID: number;
    lectureID: number;
    roomID: number;
    timeSlotID: number;
    // Data tambahan untuk tampilan (opsional)
    courseCode?: string;
    className?: string;
    lectureName?: string;
    roomCode?: string;
    day?: string;
    startTime?: Date;
    endTime?: Date;
}

// Definisikan tipe data untuk preferensi dosen
export interface LecturePreference {
    lectureID: number;
    timeslotID: number;
}

// Definisikan tipe data untuk parameter penjadwalan
export interface ScheduleData {
    courses: any[];
    classes: any[];
    rooms: any[];
    timeSlots: any[];
    lecturePreferenceMap: Record<number, number[]>;
    options?: ScheduleOptions;
}

// Definisikan tipe data untuk opsi penjadwalan
export interface ScheduleOptions {
    saveToDatabase?: boolean;
    clearExisting?: boolean;
    allowPartialResults?: boolean;
    maxAttempts?: number;
}