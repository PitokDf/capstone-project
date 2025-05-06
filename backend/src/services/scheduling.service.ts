// schedulingAlgorithm.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Definisikan tipe data untuk jadwal
interface Schedule {
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
interface LecturePreference {
    lectureID: number;
    timeslotID: number;
}

// Definisikan tipe data untuk parameter penjadwalan
interface ScheduleData {
    courses: any[];
    classes: any[];
    rooms: any[];
    timeSlots: any[];
    lecturePreferenceMap: Record<number, number[]>;
    options?: ScheduleOptions;
}

// Definisikan tipe data untuk opsi penjadwalan
interface ScheduleOptions {
    saveToDatabase?: boolean;
    clearExisting?: boolean;
    allowPartialResults?: boolean;
    maxAttempts?: number;
}

/**
 * Fungsi utama untuk menjalankan algoritma penjadwalan
 * @param options - Opsi konfigurasi penjadwalan (opsional)
 * @returns Array berisi jadwal yang berhasil dibuat
 */
async function generateSchedule(options: ScheduleOptions = {}): Promise<Schedule[]> {
    try {
        console.log('Starting schedule generation process...');

        // Ambil semua data yang diperlukan dari database
        const courses = await prisma.course.findMany({
            include: {
                lecture: true
            }
        });

        const classes = await prisma.class.findMany();

        // Ambil ruangan dan urutkan berdasarkan kapasitas (untuk optimasi)
        const rooms = await prisma.room.findMany({
            orderBy: {
                capacity: 'desc'
            }
        });

        // Ambil slot waktu dan urutkan berdasarkan hari dan waktu
        const timeSlots = await prisma.timeSlot.findMany({
            orderBy: [
                { day: 'asc' },
                { starTime: 'asc' }
            ]
        });

        // Ambil preferensi waktu untuk setiap dosen
        const lecturerPreferences = await prisma.lectureTimePrefrence.findMany({
            include: {
                lecture: true,
                timeslot: true
            }
        });

        // Kumpulkan preferensi dosen dalam format yang mudah diakses
        const lecturePreferenceMap: Record<number, number[]> = {};
        lecturerPreferences.forEach(pref => {
            if (!lecturePreferenceMap[pref.lectureID]) {
                lecturePreferenceMap[pref.lectureID] = [];
            }
            lecturePreferenceMap[pref.lectureID].push(pref.timeslotID);
        });

        console.log(`Found ${courses.length} courses, ${classes.length} classes, ${rooms.length} rooms, and ${timeSlots.length} time slots.`);

        // Data yang akan digunakan untuk backtracking
        const scheduleData: ScheduleData = {
            courses,
            classes,
            rooms,
            timeSlots,
            lecturePreferenceMap,
            options
        };

        // Hasil jadwal yang akan dikembalikan
        let schedulesResult: Schedule[] = [];

        // Mulai backtracking dengan jadwal kosong
        console.log('Starting backtracking algorithm...');
        const success = await backtrackScheduling(scheduleData, [], schedulesResult);

        if (success) {
            console.log(`Successfully generated ${schedulesResult.length} schedules.`);
        } else {
            console.log('Failed to find a complete valid schedule. Returning partial results.');
        }

        return schedulesResult;
    } catch (error) {
        console.error('Error generating schedule:', error);
        throw error;
    }
}


async function backtrackScheduling(
    data: ScheduleData,
    currentSchedule: Schedule[],
    result: Schedule[]
): Promise<boolean> {
    const { courses, classes, rooms, timeSlots, lecturePreferenceMap, options } = data;

    const totalSchedulesNeeded = courses.length * classes.length;

    if (currentSchedule.length === totalSchedulesNeeded) {
        console.log('Found complete valid schedule!');
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));

        if (options?.saveToDatabase !== false) {
            try {
                console.log('Saving schedules to database...');
                for (const schedule of currentSchedule) {
                    await prisma.schedule.create({
                        data: {
                            classID: schedule.classID,
                            courseID: schedule.courseID,
                            lectureID: schedule.lectureID,
                            roomID: schedule.roomID,
                            timeSlotID: schedule.timeSlotID
                        }
                    });
                }
                console.log('Successfully saved schedules to database.');
            } catch (error) {
                console.error('Error saving schedules to database:', error);
            }
        }

        return true;
    }

    const scheduleIndex = currentSchedule.length;
    const courseIndex = Math.floor(scheduleIndex / classes.length);
    const classIndex = scheduleIndex % classes.length;

    const course = courses[courseIndex];
    const classItem = classes[classIndex];

    if (!course || !classItem) {
        console.warn('Missing course or class data. This should not happen.');
        return false;
    }

    console.log(`Scheduling course ${course.code} for class ${classItem.code} (${scheduleIndex + 1}/${totalSchedulesNeeded})`);

    const lecturerID = course.lectureID;
    const hasPreference = lecturePreferenceMap[lecturerID] && lecturePreferenceMap[lecturerID].length > 0;

    const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        if (hasPreference) {
            const aIsPreferred = lecturePreferenceMap[lecturerID].includes(a.id);
            const bIsPreferred = lecturePreferenceMap[lecturerID].includes(b.id);

            if (aIsPreferred && !bIsPreferred) return -1;
            if (!aIsPreferred && bIsPreferred) return 1;
        }

        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.starTime.getTime() - b.starTime.getTime();
    });

    for (const timeSlot of sortedTimeSlots) {
        if (hasPreference && !lecturePreferenceMap[lecturerID].includes(timeSlot.id)) {
            continue;
        }

        for (const room of rooms) {
            if (isValidPlacement(currentSchedule, course.id, classItem.id, room.id, timeSlot.id, lecturerID)) {
                const newSchedule: Schedule = {
                    courseID: course.id,
                    classID: classItem.id,
                    lectureID: lecturerID,
                    roomID: room.id,
                    timeSlotID: timeSlot.id,
                    courseCode: course.code,
                    className: classItem.code,
                    lectureName: course.lecture.name,
                    roomCode: room.code,
                    day: timeSlot.day,
                    startTime: timeSlot.starTime,
                    endTime: timeSlot.endTime
                };

                currentSchedule.push(newSchedule);

                const success = await backtrackScheduling(data, currentSchedule, result);
                if (success) return true;

                currentSchedule.pop(); // backtrack
            }
        }
    }

    if (options?.allowPartialResults && currentSchedule.length > 0) {
        console.log(`Could not complete full schedule. Returning partial schedule with ${currentSchedule.length}/${totalSchedulesNeeded} schedules.`);
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));
        return false;
    }

    console.log(`No valid placement found for course ${course.code} and class ${classItem.code}. Backtracking...`);
    return false;
}

function isValidPlacement(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number
): boolean {
    for (const schedule of currentSchedule) {

        // cek apakah mata kuliah sudah terjadwal dan sudah menempati slot
        if (schedule.courseID === courseID && schedule.timeSlotID === timeSlotID) return false

        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID) {
            return false;
        }

        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID) {
            return false;
        }

        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID) {
            return false;
        }
    }

    return true;
}

// /**
//  * Fungsi rekursif backtracking untuk menjadwalkan perkuliahan
//  * @param data - Data yang diperlukan untuk penjadwalan
//  * @param currentSchedule - Jadwal sementara yang sedang disusun
//  * @param result - Array untuk menyimpan hasil jadwal final
//  * @returns true jika berhasil menjadwalkan semua, false jika tidak
//  */
// async function backtrackScheduling(
//     data: ScheduleData,
//     currentSchedule: Schedule[],
//     result: Schedule[]
// ): Promise<boolean> {
//     const { courses, classes, rooms, timeSlots, lecturePreferenceMap, options } = data;

//     // Basis kasus: semua mata kuliah dan kelas sudah dijadwalkan
//     const totalSchedulesNeeded = courses.length * classes.length;
//     if (currentSchedule.length === totalSchedulesNeeded) {
//         console.log('Found complete valid schedule!');

//         // Salin jadwal yang berhasil dibuat ke dalam result
//         result.push(...JSON.parse(JSON.stringify(currentSchedule)));

//         // Simpan ke database jika opsi saveToDatabase = true
//         if (options?.saveToDatabase !== false) {
//             try {
//                 console.log('Saving schedules to database...');
//                 for (const schedule of currentSchedule) {
//                     await prisma.schedule.create({
//                         data: {
//                             classID: schedule.classID,
//                             courseID: schedule.courseID,
//                             lectureID: schedule.lectureID,
//                             roomID: schedule.roomID,
//                             timeSlotID: schedule.timeSlotID
//                         }
//                     });
//                 }
//                 console.log('Successfully saved schedules to database.');
//             } catch (error) {
//                 console.error('Error saving schedules to database:', error);
//             }
//         }

//         return true;
//     }

//     // Tentukan course dan class yang akan dijadwalkan berikutnya
//     const scheduleIndex = currentSchedule.length;
//     const courseIndex = Math.floor(scheduleIndex / classes.length);
//     const classIndex = scheduleIndex % classes.length;

//     // Ambil course dan class yang akan dijadwalkan
//     const course = courses[courseIndex];
//     const classItem = classes[classIndex];

//     if (!course || !classItem) {
//         console.warn('Missing course or class data. This should not happen.');
//         return false;
//     }

//     console.log(`Scheduling course ${course.code} for class ${classItem.code} (${scheduleIndex + 1}/${totalSchedulesNeeded})`);

//     // Optimalkan pencarian dengan mencoba kombinasi yang lebih mungkin berhasil terlebih dahulu
//     const lecturerID = course.lectureID;
//     const hasPreference = lecturePreferenceMap[lecturerID] && lecturePreferenceMap[lecturerID].length > 0;

//     // Filter timeSlot berdasarkan preferensi dosen terlebih dahulu jika ada
//     const sortedTimeSlots = [...timeSlots].sort((a, b) => {
//         // Prioritaskan slot waktu yang sesuai dengan preferensi dosen
//         if (hasPreference) {
//             const aIsPreferred = lecturePreferenceMap[lecturerID].includes(a.id);
//             const bIsPreferred = lecturePreferenceMap[lecturerID].includes(b.id);

//             if (aIsPreferred && !bIsPreferred) return -1;
//             if (!aIsPreferred && bIsPreferred) return 1;
//         }

//         // Jika keduanya sama-sama preferred atau tidak, urutkan berdasarkan hari dan waktu
//         if (a.day !== b.day) return a.day.localeCompare(b.day);
//         return a.starTime.getTime() - b.starTime.getTime();
//     });

//     // Iterasi melalui semua kemungkinan kombinasi ruangan dan slot waktu
//     for (const timeSlot of sortedTimeSlots) {
//         // Jika ada preferensi dosen dan slot waktu ini tidak sesuai, lewati
//         if (hasPreference && !lecturePreferenceMap[lecturerID].includes(timeSlot.id)) {
//             continue;
//         }

//         // Optimasi: Coba ruangan yang sesuai kapasitas terlebih dahulu
//         for (const room of rooms) {
//             // Periksa apakah penempatan ini valid
//             if (isValidPlacement(currentSchedule, course.id, classItem.id, room.id, timeSlot.id, lecturerID)) {
//                 // Buat jadwal baru
//                 const newSchedule: Schedule = {
//                     courseID: course.id,
//                     classID: classItem.id,
//                     lectureID: lecturerID,
//                     roomID: room.id,
//                     timeSlotID: timeSlot.id,
//                     // Tambahkan informasi tambahan untuk debugging atau tampilan
//                     courseCode: course.code,
//                     className: classItem.code,
//                     lectureName: course.lecture.name,
//                     roomCode: room.code,
//                     day: timeSlot.day,
//                     startTime: timeSlot.starTime,
//                     endTime: timeSlot.endTime
//                 };

//                 // Tambahkan jadwal ke jadwal sementara
//                 currentSchedule.push(newSchedule);

//                 // Lanjutkan backtracking dengan jadwal yang sudah diperbarui
//                 const success = await backtrackScheduling(data, currentSchedule, result);

//                 if (success) {
//                     // Penempatan berhasil, tidak perlu mencoba kemungkinan lain
//                     return true;
//                 }

//                 // Jika tidak berhasil, hapus jadwal terakhir (backtrack)
//                 currentSchedule.pop();
//             }
//         }
//     }

//     // Jika kita mencapai titik ini, berarti tidak ada kombinasi valid yang ditemukan
//     // Untuk menghindari kegagalan total, kita bisa memilih untuk mengembalikan jadwal parsial
//     if (options?.allowPartialResults && currentSchedule.length > 0) {
//         console.log(`Could not complete full schedule. Returning partial schedule with ${currentSchedule.length}/${totalSchedulesNeeded} schedules.`);
//         result.push(...JSON.parse(JSON.stringify(currentSchedule)));
//         return false;
//     }

//     console.log(`No valid placement found for course ${course.code} and class ${classItem.code}. Backtracking...`);
//     return false;
// }

// /**
//  * Memeriksa apakah penempatan jadwal valid
//  * @param currentSchedule - Jadwal sementara yang sedang disusun
//  * @param courseID - ID mata kuliah
//  * @param classID - ID kelas
//  * @param roomID - ID ruangan
//  * @param timeSlotID - ID slot waktu
//  * @param lectureID - ID dosen
//  * @returns true jika penempatan valid, false jika tidak
//  */
// function isValidPlacement(
//     currentSchedule: Schedule[],
//     courseID: number,
//     classID: number,
//     roomID: number,
//     timeSlotID: number,
//     lectureID: number
// ): boolean {
//     // Periksa semua jadwal yang sudah ada
//     for (const schedule of currentSchedule) {
//         // Periksa constraint @@unique([classID, timeSlotID])
//         if (schedule.classID === classID && schedule.timeSlotID === timeSlotID) {
//             // Kelas sudah dijadwalkan pada slot waktu tersebut
//             return false;
//         }

//         // Periksa constraint @@unique([roomID, timeSlotID])
//         if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID) {
//             // Ruangan sudah digunakan pada slot waktu tersebut
//             return false;
//         }

//         // Periksa constraint @@unique([lectureID, timeSlotID])
//         if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID) {
//             // Dosen sudah mengajar pada slot waktu tersebut
//             return false;
//         }
//     }

//     // Semua pemeriksaan berhasil, penempatan valid
//     return true;
// }

/**
 * Fungsi untuk menyiapkan endpoint Express.js
 * @param options - Opsi penjadwalan
 * @returns Handler Express.js
 */
function createScheduleHandler(options: ScheduleOptions = {}) {
    return async (req: Request, res: Response) => {
        try {
            // Ambil opsi dari request body (jika ada)
            // const requestOptions = req.body.options || {};

            // Gabungkan opsi default dengan opsi dari request
            // const options: ScheduleOptions = { ...options, ...requestOptions };

            // Hapus jadwal lama jika diperlukan
            if (options.clearExisting !== false) {
                console.log('Clearing existing schedules...');
                await prisma.schedule.deleteMany({});
            }

            // Generate jadwal baru
            console.log('Generating new schedules...');
            const schedules = await generateSchedule(options);

            return res.status(200).json({
                success: true,
                message: `Schedule generated successfully with ${schedules.length} entries`,
                data: schedules
            });
        } catch (error) {
            console.error('Error in schedule handler:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate schedule',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}

export {
    generateSchedule,
    backtrackScheduling,
    isValidPlacement,
    createScheduleHandler,
    Schedule,
    ScheduleOptions,
    ScheduleData
};