import { prisma } from "../config/prisma";
import { Schedule, ScheduleData } from "../types/types";

// function untuk cek valid tidaknya penjadwalan
function isValidPlacement(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number
): boolean {

    for (const schedule of currentSchedule) {
        // jika mata kuliah sudah terjadwal dan menempati slot waktu
        if (schedule.courseID === courseID && schedule.timeSlotID === timeSlotID) return false

        // jika kelas sudah dijadwalkan 
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID) return false

        // jika ruangan sudah dijawalkan 
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID) return false

        // jika dosen sudah dijadwalkan
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID) return false
    }

    // jika berhasil melewati pengechekan diatas return truen untuk menandakan penjadwalan valid dan bisa dimasukkan ke schedule
    return true
}

//  * Fungsi rekursif backtracking untuk menjadwalkan perkuliahan
//  * @param data - Data yang diperlukan untuk penjadwalan
//  * @param currentSchedule - Jadwal sementara yang sedang disusun
//  * @param result - Array untuk menyimpan hasil jadwal final
//  * @returns true jika berhasil menjadwalkan semua, false jika tidak
export async function backtrackScheduling(
    data: ScheduleData,
    currentSchedule: Schedule[],
    result: Schedule[]
): Promise<boolean> {

    const { classes, courses, lecturePreferenceMap, rooms, timeSlots, options } = data

    // kalikan banyak mata kuliah dengan banyak kelas untuk mendapatkan banyak penjadwalan yang dibutuhkan
    const totalSchedulesNeeded = courses.length * classes.length

    // jika penjadwalan sudah cukup
    if (currentSchedule.length === totalSchedulesNeeded) {
        console.log('Found complete valid schedule');

        // Salin jadwal yang berhasil dibuat ke dalam result
        result.push(...JSON.parse(JSON.stringify(currentSchedule)))

        // jika dari request meminta untuk menyimpan ke databases
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

        return true
    }

    // Tentukan course dan class yang akan dijadwalkan berikutnya
    const scheduleIndex = currentSchedule.length;
    const courseIndex = Math.floor(scheduleIndex / classes.length);
    const classIndex = scheduleIndex % classes.length;

    // Ambil course dan class yang akan dijadwalkan
    const course = courses[courseIndex];
    const classItem = classes[classIndex];

    if (!course || !classItem) {
        console.warn('Missing course or class data. This should not happen.');
        return false;
    }

    console.log(`Scheduling course ${course.code} for class ${classItem.code} (${scheduleIndex + 1}/${totalSchedulesNeeded})`);

    // Optimalkan pencarian dengan mencoba kombinasi yang lebih mungkin berhasil terlebih dahulu
    const lecturerID = course.lectureID;
    const hasPreference = lecturePreferenceMap[lecturerID] && lecturePreferenceMap[lecturerID].length > 0;

    // Filter timeSlot berdasarkan preferensi dosen terlebih dahulu jika ada
    const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        // Prioritaskan slot waktu yang sesuai dengan preferensi dosen
        if (hasPreference) {
            const aIsPreferred = lecturePreferenceMap[lecturerID].includes(a.id);
            const bIsPreferred = lecturePreferenceMap[lecturerID].includes(b.id);

            if (aIsPreferred && !bIsPreferred) return -1;
            if (!aIsPreferred && bIsPreferred) return 1;
        }

        // Jika keduanya sama-sama preferred atau tidak, urutkan berdasarkan hari dan waktu
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.starTime.getTime() - b.starTime.getTime();
    });

    // Iterasi melalui semua kemungkinan kombinasi ruangan dan slot waktu
    for (const timeSlot of sortedTimeSlots) {
        if (hasPreference && !lecturePreferenceMap[lecturerID].includes(timeSlot.id)) {
            continue;
        }

        for (const room of rooms) {
            // Periksa apakah penempatan ini valid
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

                // Tambahkan jadwal ke jadwal sementara
                currentSchedule.push(newSchedule);

                // Lanjutkan backtracking dengan jadwal yang sudah diperbarui
                const success = await backtrackScheduling(data, currentSchedule, result);
                if (success) return true;

                currentSchedule.pop(); // Jika tidak berhasil, hapus jadwal terakhir (backtrack)
            }
        }
    }

    // Jika kita mencapai titik ini, berarti tidak ada kombinasi valid yang ditemukan
    // Untuk menghindari kegagalan total, kita bisa memilih untuk mengembalikan jadwal parsial

    if (options?.allowPartialResults && currentSchedule.length > 0) {
        console.log(`Could not complete full schedule. Returning partial schedule with ${currentSchedule.length}/${totalSchedulesNeeded} schedules.`);
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));
        return false;
    }

    console.log(`No valid placement found for course ${course.code} and class ${classItem.code}. Backtracking...`);
    return false;
}