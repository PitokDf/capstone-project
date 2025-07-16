import { prisma } from "../src/config/prisma";

async function main() {
    // Delete all data
    await prisma.schedule.deleteMany({});
    await prisma.courseLecture.deleteMany({});
    await prisma.lectureTimePrefrence.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.timeSlot.deleteMany({});
    await prisma.lecture.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("All data deleted");

    // 1. Users
    await prisma.user.createMany({
        data: [
            { email: "admin@gmail.com", username: "Admin", password: "$2a$10$Yw1KKxW0PnVFXRZLGcKFxOk1uDwk6PbuARuh9BO28ZoD3wsz4L8WO" },
        ],
        skipDuplicates: true,
    });
    console.log("Users created");

    // 2. Lectures
    await prisma.lecture.createMany({
        data: [
            { nip: "1234567890", name: "Dr. Budi" },
            { nip: "0987654321", name: "Dr. Ani" },
            { nip: "1122334455", name: "Prof. Charli" },
        ]
    });
    console.log("Lectures created");

    // 3. Courses
    const lectures = await prisma.lecture.findMany();
    await prisma.course.createMany({
        data: [
            { code: "CS101", name: "Introduction to Computer Science", sks: 3, duration: 3, lectureID: lectures[0].id },
            { code: "MA101", name: "Calculus I", sks: 3, duration: 3, lectureID: lectures[1].id },
            { code: "PHY101", name: "Physics I", sks: 4, duration: 4, lectureID: lectures[2].id },
            { code: "CS201", name: "Data Structures", sks: 3, duration: 3, lectureID: lectures[0].id },
        ]
    });
    console.log("Courses created");

    // 4. TimeSlots
    await prisma.timeSlot.createMany({
        data: [
            // Monday
            { day: "Monday", starTime: new Date(0, 0, 0, 7, 0), endTime: new Date(0, 0, 0, 8, 40) },
            { day: "Monday", starTime: new Date(0, 0, 0, 8, 40), endTime: new Date(0, 0, 0, 10, 20) },
            { day: "Monday", starTime: new Date(0, 0, 0, 10, 20), endTime: new Date(0, 0, 0, 12, 0) },
            { day: "Monday", starTime: new Date(0, 0, 0, 13, 0), endTime: new Date(0, 0, 0, 14, 40) },
            // Tuesday
            { day: "Tuesday", starTime: new Date(0, 0, 0, 7, 0), endTime: new Date(0, 0, 0, 8, 40) },
            { day: "Tuesday", starTime: new Date(0, 0, 0, 8, 40), endTime: new Date(0, 0, 0, 10, 20) },
            { day: "Tuesday", starTime: new Date(0, 0, 0, 10, 20), endTime: new Date(0, 0, 0, 12, 0) },
            // Wednesday
            { day: "Wednesday", starTime: new Date(0, 0, 0, 7, 0), endTime: new Date(0, 0, 0, 8, 40) },
            { day: "Wednesday", starTime: new Date(0, 0, 0, 8, 40), endTime: new Date(0, 0, 0, 10, 20) },
            // Thursday
            { day: "Thursday", starTime: new Date(0, 0, 0, 13, 0), endTime: new Date(0, 0, 0, 14, 40) },
            // Friday
            { day: "Friday", starTime: new Date(0, 0, 0, 7, 0), endTime: new Date(0, 0, 0, 8, 40) },
            { day: "Friday", starTime: new Date(0, 0, 0, 8, 40), endTime: new Date(0, 0, 0, 10, 20) },
        ]
    });
    console.log("TimeSlots created");

    // 5. Rooms
    await prisma.room.createMany({
        data: [
            { code: "R1", name: "Ruang 1", capacity: "30", location: "Gedung A" },
            { code: "R2", name: "Ruang 2", capacity: "40", location: "Gedung A" },
            { code: "L1", name: "Lab Komputer 1", capacity: "25", location: "Gedung B" },
        ]
    });
    console.log("Rooms created");

    // 6. Classes
    await prisma.class.createMany({
        data: [
            { code: "A", name: "Kelas A" },
            { code: "B", name: "Kelas B" },
        ]
    });
    console.log("Classes created");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
