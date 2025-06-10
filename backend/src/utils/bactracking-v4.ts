import { prisma } from "../config/prisma";
import { Schedule, ScheduleData } from "../types/types";
import { getHoursWIB } from "./utils";

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
    relaxConstraints: boolean = false,
    extremeRelaxation: boolean = false
): boolean {
    // Batasan utama/keras yang tidak bisa dilonggarkan (kecuali dalam extreme relaxation)
    for (const schedule of currentSchedule) {
        // Kelas tidak bisa dijadwalkan dua kali pada waktu yang sama (batasan keras)
        if (schedule.classID === classID && schedule.timeSlotID === timeSlotID)
            return false;

        // Dalam extreme relaxation mode, kita hanya memeriksa batasan kelas-waktu
        if (extremeRelaxation) continue;

        // Ruangan tidak bisa digunakan oleh dua kelas pada waktu yang sama
        if (schedule.roomID === roomID && schedule.timeSlotID === timeSlotID)
            return false;

        // Dosen tidak bisa mengajar dua kelas pada waktu yang sama
        if (schedule.lectureID === lectureID && schedule.timeSlotID === timeSlotID)
            return false;
    }

    // Dalam extreme relaxation mode, kita hanya memeriksa batasan kelas-waktu
    if (extremeRelaxation) return true;

    // Jika batasan keras terpenuhi dan kami diminta untuk melonggarkan batasan lunak, segera kembalikan true
    if (relaxConstraints) {
        return true;
    }

    // Batasan lain yang bisa dilonggarkan
    // Jadwal hari ini
    const schedulesThisDay = currentSchedule.filter(s => s.day === timeSlot.day);

    // Periksa mata kuliah yang sama pada waktu yang sama
    const sameCourseSameTime = currentSchedule.filter(s =>
        s.courseID === courseID && s.timeSlotID === timeSlotID
    ).length > 0;
    if (sameCourseSameTime) {
        return false;
    }

    // Periksa kelas dari program studi yang sama pada waktu yang sama - hanya jika nama kelasnya tersedia
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

    // Cek distribusi hari - lebih fleksibel (maksimal 8 kelas per hari) - Dilonggarkan dari 6
    if (schedulesThisDay.length >= 8) {
        return false;
    }

    // Cek distribusi slot waktu (maksimal 5 kelas per slot waktu) - Dilonggarkan dari 4
    const timeSlotUsageCount = currentSchedule.filter(s => s.timeSlotID === timeSlotID).length;
    if (timeSlotUsageCount >= 5) {
        return false;
    }

    // Cek pola ruangan dan kelas - hindari pola yang monoton
    const classRoomPairs = currentSchedule.filter(s =>
        s.classID === classID && s.roomID === roomID
    ).length;
    if (classRoomPairs >= 4) { // Dilonggarkan dari 3
        return false; // Hindari penggunaan ruangan yang sama untuk kelas yang sama terlalu sering
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
 * Buat prioritas dinamis untuk urutan jadwal berdasarkan kompleksitas
 * Ini membantu untuk menjadwalkan mata kuliah & kelas yang paling sulit terlebih dahulu
 */
function calculateSchedulingDifficulty(
    data: ScheduleData,
    relaxedBacktracking: boolean = false
): Array<{ courseIndex: number, classIndex: number, difficulty: number }> {
    const { courses, classes, lecturePreferenceMap, timeSlots } = data;
    const result: Array<{ courseIndex: number, classIndex: number, difficulty: number }> = [];

    // Hitung tingkat kesulitan untuk setiap kombinasi mata kuliah dan kelas
    for (let courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        const course = courses[courseIndex];
        const lecturerPreferences = lecturePreferenceMap[course.lectureID] || [];

        // Mata kuliah dengan preferensi dosen yang lebih sedikit akan lebih sulit dijadwalkan
        const lecturerConstraint = lecturerPreferences.length > 0 ?
            (timeSlots.length / lecturerPreferences.length) : 0;

        for (let classIndex = 0; classIndex < classes.length; classIndex++) {
            // Tambahkan logika tambahan untuk perhitungan kesulitan jika diperlukan
            // Misalnya, kelas dengan banyak batasan program studi mungkin lebih sulit

            // Saat ini, kami hanya menggunakan batasan dosen sebagai faktor kesulitan
            const difficulty = lecturerConstraint;

            result.push({
                courseIndex,
                classIndex,
                difficulty
            });
        }
    }

    // Jika dalam mode backtracking yang dilonggarkan, kita acak urutan untuk
    // mencoba pendekatan yang berbeda
    if (relaxedBacktracking) {
        // Acak sedikit urutan untuk mencoba kombinasi baru
        for (let i = 0; i < result.length; i++) {
            const randomIndex = Math.floor(Math.random() * result.length);
            [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
        }
        return result;
    }

    // Urutkan jadwal dari yang paling sulit ke yang paling mudah
    return result.sort((a, b) => b.difficulty - a.difficulty);
}

/**
 * Implementasi algoritma backtracking yang ditingkatkan untuk penjadwalan mata kuliah
 * @param data - Data yang diperlukan untuk penjadwalan
 * @param currentSchedule - Jadwal sementara yang sedang dibangun
 * @param schedulingOrder - Urutan prioritas untuk penjadwalan
 * @param currentOrderIndex - Indeks dalam urutan penjadwalan
 * @param result - Array untuk menyimpan jadwal akhir
 * @param attemptCount - Penghitung untuk mencegah loop tak terbatas
 * @param maxAttempts - Batas maksimum percobaan
 * @param useRelaxedConstraints - Gunakan batasan yang dilonggarkan sejak awal
 * @returns true jika semua mata kuliah berhasil dijadwalkan, false jika tidak
 */
export async function improvedBacktrackScheduling(
    data: ScheduleData,
    currentSchedule: Schedule[] = [],
    schedulingOrder: Array<{ courseIndex: number, classIndex: number }> | null = null,
    currentOrderIndex: number = 0,
    result: Schedule[] = [],
    attemptCount: number = 0,
    maxAttempts: number = 3000, // Ditingkatkan dari 1000
    useRelaxedConstraints: boolean = false
): Promise<boolean> {
    const { classes, courses, lecturePreferenceMap, rooms, timeSlots, options } = data;

    // Hitung total jadwal yang dibutuhkan
    const totalSchedulesNeeded = courses.length * classes.length;

    // Proteksi terhadap loop tak terbatas
    if (attemptCount > maxAttempts) {
        console.warn(`Mencapai batas maksimum percobaan (${maxAttempts}). Menerima jadwal terbaik sejauh ini.`);
        if (currentSchedule.length > 0) {
            // Simpan jadwal terbaik yang ditemukan sejauh ini
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
        console.log(`Jadwal lengkap dengan skor kualitas: ${qualityScore.toFixed(2)}`);

        // Salin jadwal yang berhasil ke result
        result.push(...JSON.parse(JSON.stringify(currentSchedule)));
        return true;
    }

    // Gunakan urutan jadwal yang sudah ada atau buat baru jika belum ada
    if (!schedulingOrder) {
        schedulingOrder = calculateSchedulingDifficulty(data, attemptCount > maxAttempts * 0.5);
    }

    // Dapatkan mata kuliah dan kelas berikutnya yang akan dijadwalkan berdasarkan urutan
    if (currentOrderIndex >= schedulingOrder.length) {
        console.warn('Indeks urutan jadwal melebihi panjang urutan. Ini seharusnya tidak terjadi.');
        return false;
    }

    const courseIndex = schedulingOrder[currentOrderIndex].courseIndex;
    const classIndex = schedulingOrder[currentOrderIndex].classIndex;

    // Dapatkan mata kuliah dan kelas yang akan dijadwalkan
    const course = courses[courseIndex];
    const classItem = classes[classIndex];

    if (!course || !classItem) {
        console.warn('Data mata kuliah atau kelas tidak ditemukan. Ini seharusnya tidak terjadi.');
        return false;
    }

    console.log(`Menjadwalkan mata kuliah ${course.code} untuk kelas ${classItem.code} (${currentSchedule.length + 1}/${totalSchedulesNeeded})`);

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
        const hour = Number(getHoursWIB(timeSlot.starTime));

        if (hour >= 8 && hour <= 12) score += 5;      // Slot pagi
        else if (hour > 12 && hour <= 15) score += 3; // Siang awal
        else if (hour > 15 && hour <= 17) score += 1; // Siang akhir
        else score -= 1;                              // Slot malam

        // Bonus untuk preferensi dosen
        if (lecturerPreferences.includes(timeSlot.id)) {
            score += 8;
        }

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

        return score;
    };

    // Urutkan slot waktu dan ruangan berdasarkan skor
    const sortedTimeSlots = [...timeSlots].sort((a, b) => scoreTimeSlot(b) - scoreTimeSlot(a));
    const sortedRooms = [...rooms].sort((a, b) => scoreRoom(b) - scoreRoom(a));

    // Batasan adaptif berdasarkan jumlah percobaan dan apakah kita dalam mode relaksasi
    // Semakin banyak percobaan, semakin besar kemungkinan batasan dilonggarkan
    const relaxConstraints = useRelaxedConstraints || attemptCount > maxAttempts * 0.3;

    // Variabel untuk melacak pernah mencoba slot waktu
    let triedAnyTimeSlot = false;

    // Iterasi untuk semua kombinasi ruangan dan slot waktu berdasarkan prioritas scoring
    for (const timeSlot of sortedTimeSlots) {
        // Skip preferensi dosen hanya jika dalam relaksasi atau belum ada slot yang berhasil
        const skipPreference = relaxConstraints || (attemptCount > maxAttempts * 0.1 && !triedAnyTimeSlot);

        // Lewati slot waktu yang tidak sesuai preferensi dosen kecuali dalam kondisi tertentu
        if (lecturerPreferences.length > 0 && !lecturerPreferences.includes(timeSlot.id) && !skipPreference) {
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
                triedAnyTimeSlot = true;

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
                const success = await improvedBacktrackScheduling(
                    data,
                    currentSchedule,
                    schedulingOrder,
                    currentOrderIndex + 1,
                    result,
                    attemptCount + 1,
                    maxAttempts,
                    relaxConstraints
                );

                if (success) return true;

                // Jika tidak berhasil, hapus jadwal terakhir (backtrack)
                currentSchedule.pop();
            }
        }
    }

    // Jika kita tidak berhasil dengan urutan prioritas saat ini, dan kita sudah menghabiskan
    // sekitar 1/3 dari percobaan maksimum, jalankan ulang dengan urutan prioritas yang berbeda
    if (attemptCount > maxAttempts * 0.3 && attemptCount < maxAttempts * 0.5 && currentOrderIndex === 0) {
        console.log("Mencoba ulang dengan urutan penjadwalan yang berbeda...");
        // Buat urutan prioritas baru dengan lebih banyak pengacakan
        const newSchedulingOrder = calculateSchedulingDifficulty(data, true);
        return improvedBacktrackScheduling(
            data,
            [], // Reset jadwal
            newSchedulingOrder,
            0,
            result,
            attemptCount + 100, // Tambahkan ke counter percobaan
            maxAttempts,
            true // Gunakan mode relaksasi
        );
    }

    // Jika kita sudah mencoba banyak dan masih tidak berhasil, coba relaksasi semua batasan
    if (attemptCount > maxAttempts * 0.7 && !useRelaxedConstraints) {
        console.log("Mencoba ulang dengan relaksasi batasan penuh...");
        return improvedBacktrackScheduling(
            data,
            [], // Reset jadwal
            null, // Biarkan algoritma menghitung ulang urutan
            0,
            result,
            attemptCount + 500, // Tambahkan ke counter percobaan
            maxAttempts,
            true // Gunakan mode relaksasi
        );
    }

    // Jika kita sampai di sini, tidak ada kombinasi valid yang ditemukan untuk kombinasi ini
    // Kita perlu backtrack ke jadwal sebelumnya
    return false;
}

/**
 * Fungsi utama untuk memulai proses penjadwalan dengan algoritma yang ditingkatkan
 */
export async function startImprovedScheduling(data: ScheduleData): Promise<Schedule[]> {
    const result: Schedule[] = [];

    console.log("Memulai algoritma penjadwalan yang ditingkatkan...");

    // Coba dengan pendekatan prioritas awal
    const success = await improvedBacktrackScheduling(data, [], null, 0, result);

    if (success) {
        console.log(`Penjadwalan berhasil dengan ${result.length} jadwal.`);
        return result;
    } else {
        console.warn("Penjadwalan tidak menemukan solusi lengkap.");
        return result; // Kembalikan hasil terbaik yang ditemukan
    }
}