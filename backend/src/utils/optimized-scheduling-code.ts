import { prisma } from "../config/prisma";
import { Schedule, ScheduleData } from "../types/types";

/**
 * Fungsi untuk memeriksa validitas penempatan jadwal
 * @param currentSchedule - Jadwal yang sedang dibangun
 * @param courseID - ID mata kuliah
 * @param classID - ID kelas
 * @param roomID - ID ruangan
 * @param timeSlotID - ID slot waktu
 * @param lectureID - ID dosen
 * @param timeSlot - Informasi slot waktu
 * @param relaxConstraints - Apakah batasan lunak perlu dilonggarkan
 * @returns true jika penempatan valid, false jika tidak
 */
function isValidPlacement(
    currentSchedule: Schedule[],
    courseID: number,
    classID: number,
    roomID: number,
    timeSlotID: number,
    lectureID: number,
    timeSlot: { day: string, starTime: Date, endTime: Date },
    relaxConstraints: boolean = false
): boolean {
    // Batasan utama/keras yang tidak bisa dilonggarkan
    for (const schedule of currentSchedule) {
        // Kelas tidak bisa dijadwalkan dua kali pada waktu yang sama
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID)
            return false;

        // Ruangan tidak bisa digunakan oleh dua kelas pada waktu yang sama
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID)
            return false;

        // Dosen tidak bisa mengajar dua kelas pada waktu yang sama
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID)
            return false;
    }

    // Batasan lain yang bisa dilonggarkan jika diperlukan
    if (!relaxConstraints) {
        // Jadwal hari ini
        const schedulesThisDay = currentSchedule.filter(s => s.day === timeSlot.day);

        // Periksa mata kuliah yang sama pada waktu yang sama
        const sameCourseSameTime = currentSchedule.filter(s =>
            s.courseID === courseID && s.timeSlotID === timeSlotID
        ).length > 0;
        if (sameCourseSameTime) {
            return false;
        }

        // Periksa kelas dari program studi yang sama pada waktu yang sama
        // (Mengijinkan lebih banyak kelas pada slot waktu yang sama, tapi
        // tetap mencegah kelas dari program yang sama bentrok)
        const schedulesThisTimeSlot = currentSchedule.filter(s => s.timeSlotID === timeSlotID);
        if (schedulesThisTimeSlot.length > 0) {
            const newClassName = getClassNameById(currentSchedule, classID) || "";
            const newClassPrefix = extractClassPrefix(newClassName);

            // Hanya batasi jika ada kelas dari program studi yang sama
            if (newClassPrefix !== "") {
                for (const s of schedulesThisTimeSlot) {
                    const existingClassPrefix = extractClassPrefix(s.className || "");
                    if (existingClassPrefix === newClassPrefix && s.classID !== classID) {
                        return false;
                    }
                }
            }
        }

        // Cek distribusi hari - lebih fleksibel (maksimal 5 kelas per hari)
        if (schedulesThisDay.length >= 5) {
            return false;
        }

        // Cek distribusi slot waktu (maksimal 3 kelas per slot waktu)
        const timeSlotUsageCount = currentSchedule.filter(s => s.timeSlotID === timeSlotID).length;
        if (timeSlotUsageCount >= 3) {
            return false;
        }

        // Cek pola ruangan dan kelas - hindari pola yang monoton
        const classRoomPairs = currentSchedule.filter(s =>
            s.classID === classID && s.roomID === roomID
        ).length;
        if (classRoomPairs >= 2) {
            return false; // Hindari penggunaan ruangan yang sama untuk kelas yang sama terlalu sering
        }
    }

    return true;
}

/**
 * Fungsi untuk mengekstrak prefix dari kode kelas (mis. "Teknik Info" dari "Teknik Info A")
 */
function extractClassPrefix(className: string): string {
    // Menghilangkan karakter terakhir jika merupakan huruf atau angka yang berdiri sendiri
    return className.replace(/[A-Z0-9]$/, "").trim();
}

/**
 * Fungsi untuk mendapatkan nama kelas berdasarkan ID dari jadwal saat ini
 */
function getClassNameById(schedule: Schedule[], classID: number): string {
    return schedule.find(s => s.classID === classID)?.className || "";
}

/**
 * Fungsi untuk mengevaluasi kualitas distribusi jadwal dari 0.0 sampai 1.0
 * 1.0 = distribusi sempurna, 0.0 = distribusi buruk
 */
function evaluateScheduleQuality(schedule: Schedule[]): number {
    if (schedule.length === 0) return 0;

    // Hitung kelas per hari
    const classesPerDay: Record<string, number> = {};
    // Hitung penggunaan ruangan
    const roomUsage: Record<number, number> = {};
    // Hitung penggunaan dosen
    const lecturerLoad: Record<number, number> = {};
    // Hitung penggunaan slot waktu
    const timeSlotUsage: Record<number, number> = {};
    // Hitung pasangan kelas-ruangan
    const classRoomPairs: Record<string, number> = {};

    schedule.forEach(item => {
        // Perhitungan distribusi hari
        classesPerDay[item.day!] = (classesPerDay[item.day!] || 0) + 1;
        // Perhitungan penggunaan ruangan
        roomUsage[item.roomID] = (roomUsage[item.roomID] || 0) + 1;
        // Perhitungan beban dosen
        lecturerLoad[item.lectureID] = (lecturerLoad[item.lectureID] || 0) + 1;
        // Perhitungan penggunaan slot waktu
        timeSlotUsage[item.timeSlotID] = (timeSlotUsage[item.timeSlotID] || 0) + 1;
        // Perhitungan pasangan kelas-ruangan
        const pairKey = `${item.classID}-${item.roomID}`;
        classRoomPairs[pairKey] = (classRoomPairs[pairKey] || 0) + 1;
    });

    // Dapatkan metrik distribusi
    const uniqueDays = Object.keys(classesPerDay).length;
    const uniqueRooms = Object.keys(roomUsage).length;
    const uniqueTimeSlots = Object.keys(timeSlotUsage).length;
    const avgClassesPerDay = schedule.length / uniqueDays;

    // Hitung variansi untuk skor keseimbangan
    const dayVariance = Object.values(classesPerDay).reduce(
        (acc, count) => acc + Math.pow(count - avgClassesPerDay, 2), 0
    ) / uniqueDays;

    // Cek repetisi pasangan kelas-ruangan
    const maxPairRepetition = Math.max(...Object.values(classRoomPairs));

    // Hitung skor untuk berbagai aspek (0.0 hingga 1.0)
    const daySpreadScore = Math.min(1, uniqueDays / 5); // Ideal: Gunakan semua 5 hari kerja
    const dayBalanceScore = Math.max(0, 1 - (dayVariance / (avgClassesPerDay * avgClassesPerDay)));
    const roomDiversityScore = Math.min(1, uniqueRooms / Math.min(3, schedule.length / 4));
    const timeSlotSpreadScore = Math.min(1, uniqueTimeSlots / (schedule.length * 0.75));
    const nonRepetitiveScore = Math.max(0, 1 - ((maxPairRepetition - 1) / 3));

    // Hitung total skor dengan bobot
    return Math.min(1, Math.max(0,
        (daySpreadScore * 0.25) +
        (dayBalanceScore * 0.25) +
        (roomDiversityScore * 0.2) +
        (timeSlotSpreadScore * 0.15) +
        (nonRepetitiveScore * 0.15)
    ));
}

/**
 * Implementasi algoritma backtracking untuk penjadwalan mata kuliah dengan optimasi
 * @param data - Data yang diperlukan untuk penjadwalan
 * @param currentSchedule - Jadwal sementara yang sedang dibangun
 * @param result - Array untuk menyimpan jadwal akhir
 * @param attemptCount - Penghitung untuk mencegah loop tak terbatas
 * @param maxAttempts - Batas maksimum percobaan
 * @returns true jika semua mata kuliah berhasil dijadwalkan, false jika tidak
 */
export async function backtrackScheduling(
    data: ScheduleData,
    currentSchedule: Schedule[] = [],
    result: Schedule[] = [],
    attemptCount: number = 0,
    maxAttempts: number = 1000
): Promise<boolean> {
    const { classes, courses, lecturePreferenceMap, rooms, timeSlots, options } = data;

    // Hitung total jadwal yang dibutuhkan
    const totalSchedulesNeeded = courses.length * classes.length;

    // Proteksi terhadap loop tak terbatas
    if (attemptCount > maxAttempts) {
        console.warn(`Mencapai batas maksimum percobaan (${maxAttempts}). Menerima jadwal terbaik sejauh ini.`);
        if (currentSchedule.length > 0) {
            result.push(...JSON.parse(JSON.stringify(currentSchedule)));
            return true;
        }
        return false;
    }

    // Jika semua berhasil dijadwalkan
    if (currentSchedule.length === totalSchedulesNeeded) {
        console.log('Menemukan jadwal lengkap yang valid');

        // Periksa kualitas distribusi jadwal
        const qualityScore = evaluateScheduleQuality(currentSchedule);
        if (qualityScore >= 0.7 || attemptCount > maxAttempts * 0.7) {
            console.log(`Jadwal lengkap dengan skor kualitas: ${qualityScore.toFixed(2)}`);

            // Salin jadwal yang berhasil ke result
            result.push(...JSON.parse(JSON.stringify(currentSchedule)));

            // Jika kualitas jadwal tidak tinggi dan masih ada waktu percobaan, 
            // lanjutkan mencari solusi yang lebih baik
            if (qualityScore < 0.8 && attemptCount < maxAttempts * 0.5) {
                console.log("Jadwal masih bisa ditingkatkan kualitasnya. Mencari alternatif...");
                return false;
            }

            return true;
        } else {
            console.log(`Jadwal lengkap ditemukan tapi skor kualitas hanya ${qualityScore.toFixed(2)}. Melanjutkan pencarian...`);
            return false; // Lanjutkan mencari distribusi yang lebih baik
        }
    }

    // Tentukan mata kuliah dan kelas yang akan dijadwalkan berikutnya
    const scheduleIndex = currentSchedule.length;
    const courseIndex = Math.floor(scheduleIndex / classes.length);
    const classIndex = scheduleIndex % classes.length;

    // Dapatkan mata kuliah dan kelas yang akan dijadwalkan
    const course = courses[courseIndex];
    const classItem = classes[classIndex];

    if (!course || !classItem) {
        console.warn('Data mata kuliah atau kelas tidak ditemukan. Ini seharusnya tidak terjadi.');
        return false;
    }

    console.log(`Menjadwalkan mata kuliah ${course.code} untuk kelas ${classItem.code} (${scheduleIndex + 1}/${totalSchedulesNeeded})`);

    // Dapatkan preferensi dosen
    const lecturerID = course.lectureID;
    const lecturerPreferences = lecturePreferenceMap[lecturerID] || [];

    // Fungsi scoring untuk slot waktu - memprioritaskan slot waktu yang lebih optimal
    const scoreTimeSlot = (timeSlot: any): number => {
        let score = 0;

        // Prioritaskan hari dengan kelas yang lebih sedikit untuk distribusi lebih merata
        const dayCount = currentSchedule.filter(s => s.day === timeSlot.day).length;
        score -= dayCount * 2;

        // Prioritaskan hari kerja daripada akhir pekan
        const dayScores = { 'Monday': 10, 'Tuesday': 10, 'Wednesday': 10, 'Thursday': 10, 'Friday': 8, 'Saturday': 5, 'Sunday': 0 };
        score += dayScores[timeSlot.day as keyof typeof dayScores] || 0;

        // Prioritaskan slot pagi
        const hour = timeSlot.starTime.getHours();
        if (hour >= 8 && hour <= 12) score += 5;      // Slot pagi
        else if (hour > 12 && hour <= 15) score += 3; // Siang awal
        else if (hour > 15 && hour <= 17) score += 1; // Siang akhir
        else score -= 1;                              // Slot malam

        // Bonus untuk preferensi dosen
        if (lecturerPreferences.includes(timeSlot.id)) {
            score += 8;
        }

        // Cek penggunaan slot waktu ini untuk mata kuliah serupa
        const similarCourseSlots = currentSchedule.filter(s =>
            s.courseID === course.id && s.timeSlotID === timeSlot.id
        ).length;
        score -= similarCourseSlots * 5; // Kurangi skor jika mata kuliah serupa sudah pada slot ini

        // Mencoba diversifikasi kombinasi ruangan-waktu
        const timeSlotUseCount = currentSchedule.filter(s => s.timeSlotID === timeSlot.id).length;
        // Jika slot waktu ini belum terlalu penuh, berikan bonus
        if (timeSlotUseCount < 2) {
            score += 3;
        }

        return score;
    };

    // Fungsi scoring untuk ruangan - memprioritaskan ruangan yang kurang digunakan
    const scoreRoom = (room: any): number => {
        let score = 0;

        // Prioritaskan keragaman ruangan
        const roomUsage = currentSchedule.filter(s => s.roomID === room.id).length;
        score -= roomUsage * 1.5;

        // Hindari penggunaan ruangan yang sama berulang untuk kelas yang sama
        const classRoomPairings = currentSchedule.filter(s =>
            s.classID === classItem.id && s.roomID === room.id
        ).length;
        score -= classRoomPairings * 3;

        // Hindari pola penggunaan ruangan yang terlalu konsisten
        const courseRoomPairings = currentSchedule.filter(s =>
            s.courseID === course.id && s.roomID === room.id
        ).length;
        score -= courseRoomPairings * 2;

        return score;
    };

    // Urutkan slot waktu dan ruangan berdasarkan skor
    const sortedTimeSlots = [...timeSlots].sort((a, b) => scoreTimeSlot(b) - scoreTimeSlot(a));
    const sortedRooms = [...rooms].sort((a, b) => scoreRoom(b) - scoreRoom(a));

    // Batasan adaptif berdasarkan jumlah percobaan
    // Semakin banyak percobaan, semakin besar kemungkinan batasan dilonggarkan
    const relaxConstraints = attemptCount > maxAttempts * 0.5;

    // Iterasi untuk semua kombinasi ruangan dan slot waktu berdasarkan prioritas scoring
    for (const timeSlot of sortedTimeSlots) {
        // Lewati slot waktu yang tidak sesuai preferensi dosen kecuali:
        // 1. Tidak ada preferensi yang ditentukan, atau
        // 2. Kita sudah mencoba cukup lama dan perlu melonggarkan batasan
        if (lecturerPreferences.length > 0 && !lecturerPreferences.includes(timeSlot.id) && !relaxConstraints) {
            continue;
        }

        for (const room of sortedRooms) {
            // Periksa penempatan valid berdasarkan semua batasan
            if (isValidPlacement(
                currentSchedule,
                course.id,
                classItem.id,
                room.id,
                timeSlot.id,
                lecturerID,
                timeSlot,
                relaxConstraints
            )) {
                // Buat jadwal baru
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

                // Lanjutkan backtracking dengan jadwal yang diperbarui
                const success = await backtrackScheduling(
                    data,
                    currentSchedule,
                    result,
                    attemptCount + 1,
                    maxAttempts
                );

                if (success) return true;

                // Jika tidak berhasil, hapus jadwal terakhir (backtrack)
                currentSchedule.pop();
            }
        }
    }

    // Jika kita hampir selesai tetapi tidak bisa menemukan solusi, relaksasi semua batasan
    if (currentSchedule.length >= totalSchedulesNeeded * 0.9 && attemptCount < maxAttempts * 0.9) {
        console.log(`Kita sudah mencapai ${currentSchedule.length}/${totalSchedulesNeeded} jadwal. Merelaksasi semua batasan untuk slot terakhir.`);

        // Coba semua kemungkinan slot waktu dan ruangan dengan batasan minimum
        for (const timeSlot of timeSlots) {
            for (const room of rooms) {
                // Hanya terapkan batasan dasar untuk menghindari konflik langsung
                if (isValidPlacement(currentSchedule, course.id, classItem.id, room.id, timeSlot.id, lecturerID, timeSlot, true)) {
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
                    const success = await backtrackScheduling(data, currentSchedule, result, attemptCount + 1, maxAttempts);
                    if (success) return true;
                    currentSchedule.pop();
                }
            }
        }
    }

    // Jika kita sampai di sini, tidak ada kombinasi valid yang ditemukan
    // Kita bisa memilih untuk mengembalikan jadwal parsial jika diizinkan atau jika sudah mencoba sangat lama
    if ((options?.allowPartialResults || attemptCount > maxAttempts * 0.95) && currentSchedule.length > 0) {
        console.log(`Tidak dapat melengkapi jadwal. Mengembalikan jadwal parsial dengan ${currentSchedule.length}/${totalSchedulesNeeded} jadwal.`);
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));
        return true; // Return true meskipun parsial, karena ini adalah hasil terbaik yang bisa kita capai
    }

    console.log(`Tidak ditemukan penempatan valid untuk mata kuliah ${course.code} dan kelas ${classItem.code}. Backtracking...`);
    return false;
}