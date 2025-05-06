import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type ScheduleInput = {
    classID: number;
    courseID: number;
    lectureID: number;
    roomID: number;
    timeSlotID: number;
};

type ComboTemplate = {
    lectureID: number;
    roomID: number;
    timeSlotID: number;
};

export async function generateOptimizedSchedule() {
    // 1. Fetch data
    const [classIds, coursesRaw, lectures, rooms, timeSlots, prefs] = await Promise.all([
        prisma.class.findMany().then(rs => rs.map(c => c.id)),
        prisma.course.findMany(),
        prisma.lecture.findMany(),
        prisma.room.findMany(),
        prisma.timeSlot.findMany(),
        prisma.lectureTimePrefrence.findMany()
    ]);

    // 2. Map code → course unik (kayak elo dulu)
    const courses = Array.from(new Map(coursesRaw.map(c => [c.code, c])).values());

    // 3. Buat map Lecture → daftar combos (room×timeslot) yang valid
    const prefSet = new Set(prefs.map(p => `${p.lectureID}_${p.timeslotID}`));
    const combosByLecture = new Map<number, ComboTemplate[]>();
    for (const lec of lectures) {
        const arr: ComboTemplate[] = [];
        for (const slot of timeSlots) {
            if (!prefSet.has(`${lec.id}_${slot.id}`)) continue;
            for (const room of rooms) {
                arr.push({ lectureID: lec.id, roomID: room.id, timeSlotID: slot.id });
            }
        }
        combosByLecture.set(lec.id, arr);
    }

    // 4. Buat tasks list dengan lectureID dari setiap course
    const tasks: { classID: number; courseID: number; lectureID: number }[] = [];
    for (const classID of classIds) {
        for (const course of courses) {
            tasks.push({ classID, courseID: course.id, lectureID: course.lectureID });
        }
    }

    // 5. State untuk cek bentrok
    const usedClassSlot = new Set<string>();
    const usedLectureSlot = new Set<string>();
    const usedRoomSlot = new Set<string>();

    // reset schedule
    await prisma.schedule.deleteMany();

    // 6. Backtracking
    function backtrack(idx: number, current: ScheduleInput[]): ScheduleInput[] | null {
        if (idx >= tasks.length) return current;

        const { classID, courseID, lectureID } = tasks[idx];
        const combos = combosByLecture.get(lectureID) || [];
        for (const tpl of combos) {
            const keyC = `${classID}_${tpl.timeSlotID}`;
            const keyL = `${tpl.lectureID}_${tpl.timeSlotID}`;
            const keyR = `${tpl.roomID}_${tpl.timeSlotID}`;
            if (usedClassSlot.has(keyC) || usedLectureSlot.has(keyL) || usedRoomSlot.has(keyR))
                continue;

            // assign
            current.push({
                classID,
                courseID,
                lectureID: tpl.lectureID,
                roomID: tpl.roomID,
                timeSlotID: tpl.timeSlotID
            });
            usedClassSlot.add(keyC);
            usedLectureSlot.add(keyL);
            usedRoomSlot.add(keyR);

            const res = backtrack(idx + 1, current);
            if (res) return res;

            // undo
            current.pop();
            usedClassSlot.delete(keyC);
            usedLectureSlot.delete(keyL);
            usedRoomSlot.delete(keyR);
        }

        return null;
    }

    const result = backtrack(0, []);
    if (!result) {
        throw new Error(
            "Gak ada solusi valid. Cek kembali preferensi waktu/lecture/room elo, mungkin ada yang bentrok semua."
        );
    }

    // 7. Simpan ke DB
    await prisma.schedule.createMany({ data: result });
    return result;
}
