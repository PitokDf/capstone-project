import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // 1. Users
    await prisma.user.createMany({
        data: [
            { email: "alice@mail.com", username: "alice01", password: "pass123" },
            { email: "bob@mail.com", username: "bob02", password: "pass456" },
        ],
    });

    // 2. Classes
    await prisma.class.createMany({
        data: [
            { code: "TI-1A", name: "Teknik Info A" },
            { code: "TI-1B", name: "Teknik Info B" },
        ],
    });

    // 3. Lectures (dosen)
    const lecture = await prisma.lecture.createMany({
        data: [
            { nip: "1987654321", name: "Dr. Budi Santoso" },
            { nip: "1976543210", name: "Prof. Siti Nurhaliza" },
        ],
    });

    // 4. Courses (mata kuliah) — note lectureID mapping
    await prisma.course.createMany({
        data: [
            { code: "SI-1", name: "Sistem Informasi 1", sks: 3, duration: 2, lectureID: 1 },
            { code: "SI-2", name: "Sistem Informasi 2", sks: 3, duration: 2, lectureID: 2 },
        ],
    });

    // 5. Rooms
    await prisma.room.createMany({
        data: [
            { code: "RKA", name: "Ruang Kuliah A", capacity: "40", location: "Gedung Barat" },
            { code: "RKB", name: "Ruang Kuliah B", capacity: "30", location: "Gedung Barat" },
        ],
    });

    // 6. TimeSlots
    await prisma.timeSlot.createMany({
        data: [
            // format ISO buat datetime
            { day: "Monday", starTime: new Date("2025-05-05T08:00:00Z"), endTime: new Date("2025-05-05T10:00:00Z") },
            { day: "Tuesday", starTime: new Date("2025-05-06T08:00:00Z"), endTime: new Date("2025-05-06T10:00:00Z") },
            { day: "Wednesday", starTime: new Date("2025-05-07T08:00:00Z"), endTime: new Date("2025-05-07T10:00:00Z") },
        ],
    });

    // 7. LectureTimePreferences
    await prisma.lectureTimePrefrence.createMany({
        data: [
            // Dr. Budi (id=1) cuma prefer Tuesday & Wednesday slot
            { lectureID: 1, timeslotID: 2 },
            { lectureID: 1, timeslotID: 3 },
            // Prof. Siti (id=2) prefer Monday & Tuesday slot
            { lectureID: 2, timeslotID: 1 },
            { lectureID: 2, timeslotID: 2 },
        ],
    });

    // 8. (Optional) Schedule hasil generateOptimizedSchedule()
    // misal hasilnya:
    await prisma.schedule.createMany({
        data: [
            // kelas TI-1A (id=1), SI-1 (courseID=1) → Dr. Budi Selasa
            { classID: 1, courseID: 1, lectureID: 1, roomID: 1, timeSlotID: 2 },
            // kelas TI-1A (id=1), SI-2 (courseID=2) → Prof. Siti Senin
            { classID: 1, courseID: 2, lectureID: 2, roomID: 2, timeSlotID: 1 },
            // kelas TI-1B (id=2), SI-1 → Dr. Budi Rabu
            { classID: 2, courseID: 1, lectureID: 1, roomID: 1, timeSlotID: 3 },
            // kelas TI-1B (id=2), SI-2 → Prof. Siti Selasa
            { classID: 2, courseID: 2, lectureID: 2, roomID: 2, timeSlotID: 2 },
        ],
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
