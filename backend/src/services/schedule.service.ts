
import { prisma } from "../config/prisma";
import { Schedule, ScheduleData } from "../types/types";
import { backtrackScheduling } from "../utils/bactracking-v3";
// import { backtrackScheduling } from "../utils/bactraking";
import { AppError } from "../utils/errorHandler";

export async function getSchedulesService() {
    const schedules = await prisma.schedule.findMany({
        include: { class: true, course: true, lecture: true, room: true, timeSlot: true }
    })

    return schedules
}

export async function addScheduleService(classID: number,
    courseID: number,
    lectureID: number,
    roomID: number,
    timeSlotID: number) {
    const newSchedule = await prisma.schedule.create({
        data: {
            classID,
            courseID,
            lectureID,
            roomID,
            timeSlotID
        }
    })

    return newSchedule
}

export async function updateScheduleService(id: number, classID: number,
    courseID: number,
    lectureID: number,
    roomID: number,
    timeSlotID: number) {
    const updateSchdule = await prisma.schedule.update({
        data: {
            classID,
            courseID,
            lectureID,
            roomID,
            timeSlotID
        },
        where: { id }
    })

    return updateSchdule
}

export async function deleteScheduleService(id: number) {
    const deleteSchedule = await prisma.schedule.delete({
        where: { id }
    })

    return deleteSchedule
}

interface ScheduleOptions {
    saveToDatabase?: boolean;
    clearExisting?: boolean;
    allowPartialResults?: boolean;
    maxAttempts?: number;
}

export async function generateScheduleService(options: ScheduleOptions = {}): Promise<Schedule[]> {
    try {
        console.log(`Starting schedule generation process...`);

        if (options.clearExisting !== false) {
            console.log('Clearing existing schedules...');
            await prisma.schedule.deleteMany({});
        }

        // ambil data mata kuliah dari databases
        const courses = await prisma.course.findMany({
            include: {
                lecture: true
            }
        })

        // Ambil data kelas dari databases
        const classes = await prisma.class.findMany()

        // Ambil data ruangan dari database dan urutkan berdasarkan kapasitas
        const rooms = await prisma.room.findMany({
            orderBy: {
                capacity: "desc"
            }
        })

        // Ambil data slot waktu dan urutkan berdasarkan hari dan jam mulai
        const timeSlots = await prisma.timeSlot.findMany({
            orderBy: [
                { day: "asc" },
                { starTime: "asc" }
            ]
        })

        // Ambil preferensi waktu untuk setiap dosen
        const lecturerPreferences = await prisma.lectureTimePrefrence.findMany({
            include: {
                lecture: true,
                timeslot: true
            }
        })

        // Kumpulkan preferensi dosen dalam format yang mudah diakses
        const lecturePreferenceMap: Record<number, number[]> = {}; // output: {1, [1,2,3]} => kiri: lectureID, kanan: timeslotID
        lecturerPreferences.forEach(pref => {
            if (!lecturePreferenceMap[pref.lectureID]) {
                lecturePreferenceMap[pref.lectureID] = [];
            }
            lecturePreferenceMap[pref.lectureID].push(pref.timeslotID);
        });

        console.log(`Found ${courses.length} courses, ${classes.length} classes, ${rooms.length} rooms, and ${timeSlots.length} time slots.`);

        // Data yang akan digunakan pada algoritma bactracking
        const scheduleData: ScheduleData = {
            classes, courses, lecturePreferenceMap, rooms, timeSlots, options
        }

        // Variabel untuk menyimpan hasil penjadwalan
        let schedulesResult: Schedule[] = []

        // Memulai panjadwalan dengan jadwal awal kosong
        console.log("Starting bactracking algorithm...");
        const success = await backtrackScheduling(scheduleData, [], schedulesResult)

        if (success) {
            console.log(`Successfully generated ${schedulesResult.length} schedules.`);
        } else {
            console.log('Failed to find a complete valid schedule. Returning partial results.');
        }

        return schedulesResult
    } catch (error: any) {
        console.error('Error generating schedule:', error);
        throw new AppError(error.message)
    }
}